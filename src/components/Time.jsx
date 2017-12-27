import React, { Component } from "react";
import classnames from "classnames";

class Time extends Component {
  getTime() {
    const now = new Date();
    let hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
    let mins =
      now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    return <div>{hours}<div className="dots">:</div>{mins}</div>;
  }

  render() {
    return <div className="time">{this.getTime()}</div>;
  }
}

export default Time;
