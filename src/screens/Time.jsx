import React, { Component } from "react";

class Time extends Component {
  getTime() {
    const now = new Date();
    let hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
    let mins = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    return `${hours}:${mins}`
  }

  render() {
    return (
      <div>
        <h2>
          It is currently
          <div className="Time__time">{this.getTime()}</div>
          on
          <div className="Time__date">{new Date().toDateString()}</div>
        </h2>
      </div>
    );
  }
}

export default Time;
