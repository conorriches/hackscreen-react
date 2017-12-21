import React, { Component } from "react";
import classnames from "classnames";
import openSocket from "socket.io-client";

//Our components
import Announcement from "./components/Announcement";
import Notification from "./components/Notification";
import Status from "./components/Status";
import * as Screens from "./screens";

//Our global config object which specifies order and timings
import Config from "./config.json";

const socket = openSocket(`${Config.socket.server}:${Config.socket.port}`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, slide: "", hide: 0, status: "Door Closed" };
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

      socket.on("DATA", data => {
        console.log(data);
        this.setState({ data: data });
      });
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

  handleData(data) {
    let result = JSON.parse(data);
    console.log(result);
  }

  render() {
    const Component = Screens[this.state.slide];

    return (
      <div id="App">
        <div
          className={classnames("fs", this.state.slide, {
            hidden: this.state.hide
          })}
        >
          {Component ? <Component /> : <div>Loading...</div>}
        </div>
        <Announcement>
          {this.state.status && <Status text={this.state.status} />}
          {this.state.notification && (
            <Notification text={this.state.notification} />
          )}
        </Announcement>
      </div>
    );
  }
}

export default App;
