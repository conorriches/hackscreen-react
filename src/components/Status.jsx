import React, { Component } from "react";
import classnames from "classnames";

class Status extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classnames("status", this.props.className, this.props.condition?"on":"off")}>
        {this.props.condition ? this.props.true : this.props.false}
      </div>
    );
  }
}

export default Status;
