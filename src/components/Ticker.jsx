import React, { Component } from "react";
import classnames from "classnames";

class Ticker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classnames("ticker-wrap", this.props.className)}>
        <div className="ticker-fade"/>
        <div className="ticker">
          {this.props.items.map(k => {
            console.log(k);
            return <li><span className="title">{k.title}</span>{k.value}</li>;
          })}
        </div>
      </div>
    );
  }
}

export default Ticker;
