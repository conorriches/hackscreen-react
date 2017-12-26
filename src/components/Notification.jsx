import React, { Component } from "react";
import classNames from "classnames";
import Config from "../config.json";
class Notification extends Component {
  render() {
    return (
      <div
        className={classNames(
          "notification",
          this.props.text !== Config.notification.bye ? "active" : "inactive"
        )}
      >
        {this.props.text}
      </div>
    );
  }
}

export default Notification;
