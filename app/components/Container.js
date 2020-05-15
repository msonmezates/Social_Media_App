import React from "react";

export default props => (
  <div
    className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}
  >
    {props.children}
  </div>
);
