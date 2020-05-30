import React from "react";
import { Link } from "react-router-dom";

import Page from "./Page";

export default () => (
  <Page title="Not Found">
    <div className="text-center">
      <h2>Whoops, page not found!</h2>
      <p className="lead text-muted">
        You can always visit the <Link to="/">homepage</Link> to get a fresh
        start.
      </p>
    </div>
  </Page>
);
