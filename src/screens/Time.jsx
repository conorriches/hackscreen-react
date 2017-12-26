import React, { Component } from "react";

class Time extends Component {
  render() {
    const now = new Date();
    return (
      <div>
        <h2>
          It is currently
          <div className="time">{`${now.getHours()}:${now.getMinutes()}`}</div>
          on
          <div className="date">{now.toDateString()}</div>
        </h2>
      </div>
    );
  }
}

export default Time;
