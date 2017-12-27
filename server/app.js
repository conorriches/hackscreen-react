// server/app.js
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const io = require("socket.io")();
const mqtt = require("mqtt");
const config = require("../src/config.json");
const https = require("https");

const app = express();
const MQTTclient = mqtt.connect(config.mqtt.server);

MQTTclient.on("connect", function() {
  console.log("MQTT: connected", config.mqtt.server);
  MQTTclient.subscribe("door/#");
  MQTTclient.subscribe("button/big/red/state");
  //MQTTclient.publish('presence', 'Hello mqtt')
});

io.listen(config.socket.port);
io.on("connection", socket => {
  console.log("Client connected: ID", socket.id);

  // When we get a message, send to client
  MQTTclient.on("message", function(topic, message) {
    switch (topic) {
      case "door/outer/opened/username":
        socket.emit("USER_ENTERED", message.toString());
        break;
      case "door/outer/opened/key":
        socket.emit("MANUAL_OVERRIDE", message.toString());
        break;
      case "door/outer/state":
        socket.emit("DOOR_STATE", message.toString());
        break;
      case "door/outer/doorbell":
        socket.emit("DOORBELL", message.toString());
        break;
      default:
        console.log("Unknown topic", topic);
    }
  });

  //When the client tells us the slide changed
  socket.on("SLIDE_CHANGED", slideName => {
    console.log("Slide changed to ", slideName);

    if (slideName === "Metrolink") {
      console.log("Getting Met times");

      let URL =
        "https://api.tfgm.com/odata/Metrolinks?key=<YOUR_TFGM_API_KEY_HERE>&$filter=TLAREF eq 'NIS'";

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
              lastUpdated: new Date().toUTCString(),
            };

            const json = JSON.parse(data);
           
            json.value.forEach(i => {
              toReturn.platforms.push({
                line: i.Line,
                direction: i.Direction,
                messageBoard: i.MessageBoard,
                trams: [
                  { destination: i.Dest0, carriages: i.Carriages0, wait: i.Wait0 },
                  { destination: i.Dest1, carriages: i.Carriages1, wait: i.Wait1 },
                  { destination: i.Dest2, carriages: i.Carriages2, wait: i.Wait2 },
                ]
              });
            });
            socket.emit("METROLINK", toReturn);
          });
        })
        .on("error", err => {
          console.log("Error: " + err.message);
        });
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

module.exports = app;