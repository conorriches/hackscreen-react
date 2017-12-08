import React, { Component } from "react";
import Transition from "react-transition-group/Transition";

class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidUpdate() {
    const active = this.props.active;
    const elemName = this.props.children.type.name;
    console.log(elemName);

    if (
      (active == elemName && !this.state.show) ||
      (active != elemName && this.state.show)
    )
      this.setState({ show: active == elemName });
    //console.log(active == elemName);
  }

  render() {
    return (
      <Transition timeout="1000">
        {status => {
          return this.state.show ? (
            <div className={`screen fade fade-${status} ${this.props.children.type.name}`}>{this.props.children}</div>
          ) : (
            <div className={`screen fade`}/>
          );
        }}
      </Transition>
    );
  }
}

export default Screen;
