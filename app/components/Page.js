import React, { useEffect } from "react";
import Container from "./Container";

export default props => {
  useEffect(() => {
    document.title = `${props.title} | MyApp`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return <Container wide={props.wide}>{props.children}</Container>;
};
