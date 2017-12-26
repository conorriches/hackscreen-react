import React, { Component } from "react";

class Metrolink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: 0
    };
  }

  componentDidUpdate(p) {
    if (this.props.parentState.metrolink.platforms && this.state.gotData === 1)
      return;
    this.props.parentState.metrolink.platforms
      ? this.setState({ gotData: 1 })
      : this.setState({ gotData: 0 });
  }

  render() {
    return (
      <div>
        <h3>Metrolink Updates</h3>
        <h4>New Islington</h4>
        <div className="platforms">
          {this.state.gotData
            ? this.props.parentState.metrolink.platforms.map(platform => {
                console.log("Platform", platform);
                
                return (
                  <div className="platform">
                    <div className="direction">{platform.direction}</div>
                    <ul>
                      {platform.trams.map(tram => {
                        return <li><b>{tram.wait == 0? `arrv` : `${tram.wait} min`}</b> - {tram.destination}</li>;
                      })}
                    </ul>
                  </div>
                );
              })
            : "No data"}
        </div>
      </div>
    );
  }
}

export default Metrolink;
