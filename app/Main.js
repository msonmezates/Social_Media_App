import React from "react";
import ReactDOM from "react-dom";

const ExampleComponent = () => {
  return (
    <>
      <h1>TEST</h1>
    </>
  );
};

ReactDOM.render(<ExampleComponent />, document.getElementById("app"));

// Load changes asynchronously without refreshing page
if (module.hot) {
  module.hot.accept();
}
