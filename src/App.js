import React, { Component } from "react";

//Our components
import Announcement from "./components/Announcement";
import Notification from "./components/Notification";
import Status from "./components/Status";
import Screen from "./components/Screen";

//Our screens
import Welcome from "./screens/Welcome";
import WiFi from "./screens/WiFi";

//Our global config object which specifies order and timings
import Config from "./config.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, slide: "" };
  }

  componentDidMount() {
    this.show();
  }

  getNextIndex() {
    if (this.state.index >= Config.order.length - 1) return 0;
    return this.state.index + 1;
  }

  show() {
    //get the curernt slide
    let thisSlide = Config.order[this.state.index];
    let slideName = thisSlide.name || "";
    let slideTime = thisSlide.time * 1000 || 10000;

    console.log("Show called", thisSlide);

    this.setState({ slide: thisSlide.name, index: this.state.index });

    setTimeout(() => {
      this.setState({ index: this.getNextIndex() });

      this.show();
    }, slideTime);
  }

  render() {
    return (
      <div className="App">
        <Screen active={this.state.slide}>
          <Welcome/>
        </Screen>
        <Screen active={this.state.slide}>
          <WiFi />
        </Screen>
      </div>
    );
  }
}

export default App;
