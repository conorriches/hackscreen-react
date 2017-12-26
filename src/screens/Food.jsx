import React, { Component } from "react";

class Food extends Component {
  render() {
    return (
      <div>
        <h1>Wednesday Food Order!</h1>
        <h2 className="Food__strong">hacman.org.uk/food</h2>
        <h4>Food order closes at 7pm <img src="/assets/hamburgerparrot.gif" alt=""/></h4>
        
      </div>
    );
  }
}

export default Food;
