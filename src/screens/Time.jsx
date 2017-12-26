import React, { Component } from "react";

class Time extends Component {
  render() {
    const now = new Date();
    return (
      <div>
        <h2>
          It is currently
          <div className="Time__time">{`${now.getHours()}:${now.getMinutes()}`}</div>
          on
          <div className="Time__date">{now.toDateString()}</div>
        </h2>
      </div>
    );
  }
}

export default Time;
