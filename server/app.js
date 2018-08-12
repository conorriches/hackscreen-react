
const exec = require('exec');
const express = require("express");
const https = require("https");
const ical = require("ical");
const io = require("socket.io")();
const morgan = require("morgan");
const mqtt = require("mqtt");
const path = require("path");
const querystring = require("querystring");
const config = require("../src/config.json");
const devices = require("./devices");

const app = express();
const MQTTclient = mqtt.connect(config.mqtt.server);

let notify = false;
let latestUser = "";
let lastMessageId = 0;
let lastMessage = "";


const mqttConnect = () => {
  MQTTclient.subscribe("door/#");
  MQTTclient.subscribe("button/#");
  postToTelegram("👋 connected");
}

const mqttMessage = (topic, message) => {
  switch (topic) {
    case "door/outer/opened/username":

      io.emit("USER_ENTERED", message.toString());
      const justEntered = message.toString();
      const now = new Date();
      const niceDate = now.toLocaleTimeString();

      if (justEntered !== latestUser) {
        // New person entered
        latestUser = justEntered;
        lastMessage = `🔑 ${justEntered} (${niceDate})`;
        postToTelegram(lastMessage, false, id => {
          lastMessageId = id;
        });
      } else {
        //Update last message
        lastMessage = `${lastMessage} (${niceDate})`;
        postToTelegram(lastMessage, lastMessageId, () => { });
      }
      break;
    case "door/outer/opened/key":
      io.emit("MANUAL_OVERRIDE", message.toString());
      postToTelegram(`🚨 ${message.toString()}`);
      notify = true;
      break;
    case "door/outer/state":
      io.emit("DOOR_STATE", message.toString());
      notify && postToTelegram(`🚪 ${message.toString()}`);
      notify = false;
      break;
    case "door/outer/doorbell":
      io.emit("DOORBELL", message.toString());
      notify = true;
      postToTelegram(`🔔 doorbell rung`);
      break;
    case "button/small/green":
      io.emit("NEXT_SLIDE", "");
      break;
    case "button/big/red/state":
      postToTelegram(`🈂️`);
      var rnd = Math.floor(Math.random() * 100)
      var audioCmd = "";

      //decide what annoyance we want
      switch (true) {
        case rnd > 90:
          audioCmd = "mpg123 ~/doorbell/audio/profanity.mp3";
          break;
        case rnd > 80:
          audioCmd = "mpg123 ~/doorbell/audio/AirHorn.mp3";
          break;
        case rnd > 70:
          audioCmd = "mpg123 ~/doorbell/audio/homer.mp3";
          break;
        case rnd > 60:
          audioCmd = "mpg123 ~/doorbell/audio/homer-boogey.mp3";
          break;
        case rnc > 50:
          audioCmd = "mpg123 ~/doorbell/audio/will.mp3";
          break;
        case rnd > 40:
          audioCmd = "mpg123 ~/doorbell/audio/bart-aye.mp3";
          break;
        case rnd > 30:
          audioCmd = "mpg123 ~/doorbell/audio/dixie.mp3";
          break;
        case rnd > 20:
          audioCmd = "mpg123 ~/doorbell/audio/Antiques.mp3";
          break;
        case rnd > 10:
          audioCmd = "mpg123 ~/doorbell/audio/THX.mp3";
          break;
        case rnd > 4:
          audioCmd = "ogg123 ~/doorbell/audio/WIlhelp_Scream.ogg";
          break;
        case rnd > 2:
          audioCmd = "mpg123 ~/doorbell/audio/yamaha.mp3";
          break;
        default:
          audioCmd = "ogg123 ~/doorbell/audio/ipenema.flac";
          break;
      }

      //play the annoyance
      exec(audioCmd, function puts(error, stdout, stderr) { });

    default:
      console.log("Unknown topic", topic);
  }
}

const postToTelegram = (message, message_id, callback) => {
  const postData = querystring.stringify({
    chat_id: config.telegram.chat_id,
    message_id,
    text: message
  });

  const options = {
    hostname: `api.telegram.org`,
    port: 443,
    path: `/bot${config.telegram.token}/${
      message_id ? "editMessageText" : "sendMessage"
      }`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length
    }
  };

  const req = https.request(options, res => {
    console.log("statusCode:", res.statusCode);
    console.log("headers:", res.headers);
    let body = "";

    res.on("data", d => {
      body += d;
    });

    res.on("end", function () {
      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(body);

      if (parsed && parsed.ok) {
        console.log(parsed);
        callback && callback(parsed.result.message_id);
      }
    });
  });

  req.on("error", e => {
    console.error(e);
  });

  req.write(postData);
  req.end();
};

//When a new client connects to the server
io.on("connection", socket => {

  socket.on("disconnect", function () {
    socket.disconnect();
  });

  //When a client tells us they changed to a new slide
  socket.on("SLIDE_CHANGED", slideName => {

    console.log("Slide Changed to " + slideName);

    // Sportsball: Hand them sportsball data
    if (slideName === "Sportsball") ical.fromURL(config.sportsball.calendar, {}, (err, data) => {
      socket.emit("SPORTSBALL", data);
    });


    // Metrolink: get the live times
    if (slideName === "Metrolink") {

      let URL = `https://api.tfgm.com/odata/Metrolinks?key=${config.metrolink.api_key}&$filter=TLAREF eq 'NIS'`;

      try {
        https
          .get(URL, resp => {
            let data = "";

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
              data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
              let toReturn = {
                platforms: [],
                lastUpdated: new Date().toUTCString()
              };

              const json = JSON.parse(data);

              if (json.value) {
                json.value.forEach(i => {
                  toReturn.platforms.push({
                    line: i.Line,
                    direction: i.Direction,
                    messageBoard: i.MessageBoard,
                    trams: [
                      {
                        destination: i.Dest0,
                        carriages: i.Carriages0,
                        wait: i.Wait0
                      },
                      {
                        destination: i.Dest1,
                        carriages: i.Carriages1,
                        wait: i.Wait1
                      },
                      {
                        destination: i.Dest2,
                        carriages: i.Carriages2,
                        wait: i.Wait2
                      }
                    ]
                  });
                });
                socket.emit("METROLINK", toReturn);
              }
            });
          })
          .on("error", err => {
            console.log("Error: " + err.message);
          });
      } catch (e) { }
    }
  });
});

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

// Serve static assets
app.use(express.static(path.resolve(__dirname, "..", "build")));

// Always return the main index.html, so react-router render the route in the client
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "src", "index.html"));
});


MQTTclient.on("connect", mqttConnect);
MQTTclient.on("message", mqttMessage);
io.listen(config.socket.port);
devices.startPoll(5000, () => {
  postToTelegram(`🆕 dash button pushed - rick roll commenced!`);
  exec('mpg123 ~/hackscreen-react/public/audio/giveyouup.mp3', function puts(error, stdout, stderr) { });
});

module.exports = app;

