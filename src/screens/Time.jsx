import React, { Component } from "react";
import TimeComponent from '../components/Time';

class Time extends Component {
  render() {
    return (
      <div>
        <h2>
          It is currently
          <div className="Time__time"><TimeComponent/></div>
          on
          <div className="Time__date">{new Date().toDateString()}</div>
        </h2>
      </div>
    );
  }
}

export default Time;
