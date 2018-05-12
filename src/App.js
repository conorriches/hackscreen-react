import React, { Component } from "react";
import classnames from "classnames";
import openSocket from "socket.io-client";

//Our components
import Notification from "./components/Notification";
import Status from "./components/Status";
import Logo from "./components/Logo";
import Time from "./components/Time";
import Ticker from "./components/Ticker";
import EmergencyNotice from "./components/EmergencyNotice";
import * as Screens from "./screens";
import Sound from "react-sound";

//Our global config object which specifies order and timings
import Config from "./config.json";
import { clearTimeout } from "timers";

const socket = openSocket(`${Config.socket.server}:${Config.socket.port}`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      slide: "",
      hide: 0,
      doorOpen: false,
      lastEntered: [],
      notification: null,
      doorbell: 0,
      emergency: null,
      audio: {
        doorbell: 0,
        entry: 0,
        emergency: 0
      },
      metrolink: {},
      sportsball: {}
    };

    socket.on("DOOR_STATE", data => {
      this.setState({ doorOpen: data === "opened" });
      this.setState({ doorbell: 0 });
    });

    socket.on("MANUAL_OVERRIDE", data => {
      this.setState({
        emergency: "MANUAL OVERRIDE KEY WAS USED AT IRON DOORS.",
        audio: { emergency: 1 }
      });
    });

    socket.on("USER_ENTERED", data => {
      this.setNotification("🔑 " + data + " has entered!");
      let d = new Date();
      let n = d.toLocaleTimeString();
      let userData = {
        name: data,
        time: n
      };
      //If we hav already seen the user, remove their last position
      const count = this.state.lastEntered.filter(n => {
        return n.name === data;
      }).length;
      if (count > 0) {
        this.setState({
          lastEntered: this.state.lastEntered.filter(item => {
            return item.name !== data;
          })
        });
        this.setState({ audio: { entry: 2 } });
      } else {
        this.setState({ audio: { entry: 1 } });
      }

      this.setState({
        lastEntered: this.state.lastEntered.slice(-5).concat(userData)
      });
    });

    socket.on("DOORBELL", data => {
      this.setNotification("🔔 DOORBELL AT IRON DOORS 🔔");
      this.setState({ doorbell: 1, audio: { doorbell: 1 } });
    });

    socket.on("METROLINK", data => {
      this.setState({ metrolink: data });
    });

    socket.on("SPORTSBALL", data => {
      this.setState({ sportsball: data });
    });
  }

  setNotification(data) {
    //show the notification
    this.setState({ notification: data });

    //set up new timeout
    setTimeout(() => {
      this.setState({ notification: null });
    }, Config.notification.delay);
  }

  componentDidMount() {
    this.show();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  getNextIndex() {
    if (this.state.index >= Config.order.length - 1) return 0;
    return this.state.index + 1;
  }

  show() {
    //clear slides
    this.setState({ hide: 1 });

    setTimeout(() => {
      //Then update the new one
      //get the curernt slide
      let thisSlide = Config.order[this.state.index];
      let slideName = thisSlide.name || "";
      let slideTime = thisSlide.time * 1000 || 10000;

      socket.emit("SLIDE_CHANGED", slideName);

      this.setState({
        slide: thisSlide.name,
        index: this.state.index,
        hide: 0
      });
      setTimeout(() => {
        this.setState({ index: this.getNextIndex() });

        this.show();
      }, slideTime);
    }, 1000);
  }

  render() {
    const Component = Screens[this.state.slide];

    return (
      <div id="App">
        <Sound
          url="/audio/doorbell.ogg"
          playStatus={
            this.state.audio.doorbell
              ? Sound.status.PLAYING
              : Sound.status.STOPPED
          }
          playFromPosition={0}
          onFinishedPlaying={() => {
            this.setState({ audio: { doorbell: 0 } });
          }}
        />

        <Sound
          url="/audio/entered.ogg"
          playStatus={
            this.state.audio.entry === 1
              ? Sound.status.PLAYING
              : Sound.status.STOPPED
          }
          playFromPosition={0}
          onFinishedPlaying={() => {
            this.setState({ audio: { entry: 0 } });
          }}
        />

        <Sound
          url="/audio/reentered.ogg"
          playStatus={
            this.state.audio.entry === 2
              ? Sound.status.PLAYING
              : Sound.status.STOPPED
          }
          playFromPosition={0}
          onFinishedPlaying={() => {
            this.setState({ audio: { entry: 0 } });
          }}
        />

        <Sound
          url="/audio/alarm.mp3"
          playStatus={
            this.state.audio.emergency
              ? Sound.status.PLAYING
              : Sound.status.STOPPED
          }
          playFromPosition={0}
          onFinishedPlaying={() => {
            this.setState({ audio: { emergency: 0 } });
          }}
        />

        <EmergencyNotice emergency={this.state.emergency}>
          <div
            className={classnames("fs", this.state.slide, {
              hidden: this.state.hide
            })}
          >
            {Component ? (
              <Component parentState={this.state} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </EmergencyNotice>

        <div className="footer">
          <Logo />
          <Time className="footer__time" />
          <Status
            className="doorbell"
            condition={this.state.doorbell}
            true="🙋🔔 SOMEONE AT DOOR"
            false="🔔"
          />
          <Status
            className="door"
            condition={this.state.doorOpen}
            true="⚠️ DOOR OPEN"
            false="️️🔐"
          />
          <Ticker
            items={[
              {
                title: "Last Entered",
                value: this.state.lastEntered
                  .slice()
                  .map(i => {
                    return i.name + " (" + i.time + ") ";
                  })
                  .reverse()
              },
              {
                title: "WiFi",
                value:
                  "To connect, select Hackspace  and enter password:T3h4x0rZ"
              }
            ]}
          />
        </div>

        <Notification
          text={this.state.notification || Config.notification.bye}
        />
      </div>
    );
  }
}

export default App;
