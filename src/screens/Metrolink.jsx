import React, { Component } from "react";

class Metrolink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: 0
    };
  }

  componentDidUpdate(p) {
    console.log(p);
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

        {this.state.gotData ? (
          <div>
            <div className="Metrolink__platforms">
              {this.props.parentState.metrolink.platforms.map(platform => {
                return (
                  <div className="Metrolink__platform">
                    
                    <div className="Metrolink__direction">
                      {platform.direction}
                    </div>

                    <ul className="Metrolink__trams">
                      {platform.trams.map((tram, i) => {
                        return tram.destination ? (
                          <li className="Metrolink__tram">
                            <b>
                              {tram.wait == 0 ? `arrv` : `${tram.wait} min`}
                            </b>{" "}
                            - {tram.destination}
                          </li>
                        ) : (
                          <li className="Metrolink__tram">
                            <b>
                              {i == 0
                                ? "No trams scheuled to depart within the next half an hour."
                                : ""}
                            </b>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="Metrolink__messageBoard">
                      {platform.messageBoard}
                    </div>
                    
                  </div>
                );
              })}
            </div>

            <div className="Metrolink__lastUpdated">
              Updated @ {this.props.parentState.metrolink.lastUpdated}
            </div>
          </div>
        ) : (
          "No data"
        )}
      </div>
    );
  }
}

export default Metrolink;
