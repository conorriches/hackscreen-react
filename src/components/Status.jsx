import React, { Component } from "react";
import Transition from "react-transition-group/Transition";

class Status extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="status">
        <div className="door">
          Door open
        </div>
      </div>
    );
  }
}

export default Status;
