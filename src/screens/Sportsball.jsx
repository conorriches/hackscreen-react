import React, { Component } from "react";

class Sportsball extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(p) {
    console.log("Updated");
    console.log(p.parentState);
    p.parentState.sportsball.data &&
      this.setState({ data: p.parentState.sportsball.data });
  }

  render() {
    return (
      <div>
        <h3>City Stadium Updates</h3>

        {this.state.data ? (
          <div>Next Event:</div>
        ) : (
          "No event data available"
        )}
      </div>
    );
  }
}

export default Sportsball;
