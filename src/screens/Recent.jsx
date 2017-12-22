import React, { Component } from "react";

class Recent extends Component {
  render() {
    return (
      <div>
        <h1>Recent Visitors</h1>
        {this.props.parentState.lastEntered.slice(0).reverse().map(u => <li>{u}</li>)}
      </div>
    );
  }
}

export default Recent;
