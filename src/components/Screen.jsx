import React, { Component } from "react";
import Transition from "react-transition-group/Transition";
import * as Components from '../screens'


class Screen extends Component {
  render() {
    return (
      <Transition timeout="1000">
        {status => {
          return true ? (
            <div className={`screen fade fade-${status}`}>{this.props.children}</div>
          ) : (
            <div className={`screen fade`}/>
          );
        }}
      </Transition>
    );
  }
}

export default Screen;
