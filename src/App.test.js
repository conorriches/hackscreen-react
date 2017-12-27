import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});

describe("startup", () => {
  it("should initiate an empty state set", () => {
    expect (App.state).toBe({
      index: 0,
      slide: "",
      hide: 0,
      doorOpen: false,
      lastEntered: [],
      notification: null,
      doorbell: 0,
      emergency: null,
      audio: {
        doorbell: 0,
        entry: 0,
        emergency: 0
      },
      metrolink: {}
    });
  });
});
