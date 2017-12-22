import React, { Component } from "react";
import classnames from "classnames";

class Status extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="status">
        {this.props.doorbell ? (
          <div className="doorbell">🔔</div>
        ) : <div/>}
        <div className={classnames("door", this.props.state ? "danger" : "")}>
          {this.props.state ? "DOOR OPEN ⚠️" : " DOOR CLOSED👌"}
        </div>
      </div>
    );
  }
}

export default Status;
