import React, { Component } from "react";
import { Connector, subscribe } from "mqtt-react";
import classnames from 'classnames';

//Our components
import Announcement from "./components/Announcement";
import Notification from "./components/Notification";
import Status from "./components/Status";
import Screen from "./components/Screen";

//Our screens
import Welcome from "./screens/Welcome";
import WiFi from "./screens/WiFi";
import Food from "./screens/Food";
import Music from "./screens/Music";
import MMMM from "./screens/MMMM";

//Our global config object which specifies order and timings
import Config from "./config.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, slide: "", hide: 0 };
  }

  componentDidMount() {
    this.show();
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
    return (
      <Connector mqttProps={Config.MQTT.address}>
        <div id="App" className={classnames({"hidden": this.state.hide})}>
          <Screen active={this.state.slide}>
            <Welcome />
          </Screen>
          <Screen active={this.state.slide}>
            <WiFi />
          </Screen>
          <Screen active={this.state.slide}>
            <Food />
          </Screen>
          <Screen active={this.state.slide}>
            <Music />
          </Screen>
          <Screen active={this.state.slide}>
            <MMMM />
          </Screen>

          {subscribe({ topic: "@near/demo" })(
            <div>
              <Status />
              <Notification />
            </div>
          )}
        </div>
      </Connector>
    );
  }
}

export default App;
