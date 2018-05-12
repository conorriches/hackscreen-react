import React, { Component } from "react";

class Sportsball extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false
    };
  }

  componentDidUpdate(p) {
    const data = this.props.parentState.sportsball;

    //If there are no upcoming events, reload data in.
    if (!this.state.loaded) {
      const upcoming = Object.values(data)
        .filter(item => {
          return item.location === "Etihad Stadium";
        })
        .filter(item => {
          return Date.parse(item.end) >= Date.now();
        })
        .sort((a, b) => {
          return Date.parse(a.end) > Date.parse(b.end);
        })
        .slice(0, 3);

      this.setState({ data: upcoming });
      this.setState({ loaded: true });
    }
  }

  render() {
    return (
      <div className="Sportsball">
        <h3>City Stadium Upcoming Sportsball</h3>

        {!this.state.loaded && "Unable to get the data 😞"}
        {this.state.loaded && this.state.data.length == 0 && "🎉 No upcoming sportsball events! 😊"}

        {this.state.data.map(d => {
          var options = {
            weekday: "short",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          };
          return (
            <div className="Sportsball__fixture">
              <span className="Sportsball__time">
                {new Date(d.start).toLocaleDateString("en-GB", options)}
              </span>
              <span className="Sportsball__name">{d.summary}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Sportsball;
