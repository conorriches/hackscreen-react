import React, { Component } from "react";

class EmergencyNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: "loading"
    };
  }

  componentWillReceiveProps(d) {
    if (d.emergency === this.props.emergency) return;
    const now = new Date();
    this.setState({ updated: now.toUTCString() });
  }

  render() {
    return this.props.emergency ? (
      <div className="emergency">
        <div className="emergency__inner">
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
