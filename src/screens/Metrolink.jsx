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

    if (!p.parentState.metrolink.platforms && !this.state.gotData) return;

    this.props.parentState.metrolink.platforms
      ? this.setState({ gotData: 1 })
      : this.setState({ gotData: 0 });
  }

  render() {
    return (
      <div>
        <h3>Live Metrolink Updates</h3>
        <h5>Trams from: New Islington</h5>

        {this.state.gotData ? (
          <div>
            <div className="Metrolink__platforms">
              {this.props.parentState.metrolink.platforms.map(platform => {
                return (
                  <div className="Metrolink__platform">
                    <div className="Metrolink__direction">
                      {platform.direction == "Incoming"
                        ? "Inbound <small>to City Centre</small>"
                        : "Outbound <small>to Etihad & Ashton</small>"}
                    </div>

                    <ul className="Metrolink__trams">
                      {platform.trams.map((tram, i) => {
                        return tram.destination ? (
                          <li className="Metrolink__tram">
                            <b>{tram.wait < 1 ? `arrv` : `${tram.wait} min`}</b>{" "}
                            - {tram.destination}
                          </li>
                        ) : (
                          <li className="Metrolink__tram">
                            <b>
                              {i === 0
                                ? "No trams scheduled to depart within the next half an hour."
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
          "Please Wait - LIVE tram data coming soon."
        )}
      </div>
    );
  }
}

export default Metrolink;
