import React, { Component } from "react";
import Transition from "react-transition-group/Transition";

class Announcement extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      this.props.children
    );
  }
}

export default Announcement;
