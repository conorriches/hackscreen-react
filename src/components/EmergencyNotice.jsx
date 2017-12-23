import React, { Component } from "react";
import Transition from "react-transition-group/Transition";
import * as Components from "../screens";

class EmergencyNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: "loading"
    };
  }

  componentWillReceiveProps(d) {
    if (d.emergency === this.props.emergency) return;

    console.log("GOT PROPS FUCKO")

    const now = new Date();
    this.setState({ updated: now.toUTCString() });
  }

  render() {
    return this.props.emergency ? (
      <div className="emergency">
        <div className="inner">
          <h2>{this.state.updated}</h2>
          {this.props.emergency}
        </div>
      </div>
    ) : (
      <div className="fs">{this.props.children}</div>
    );
  }
}

export default EmergencyNotice;
