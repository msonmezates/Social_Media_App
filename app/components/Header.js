import React, { useContext } from "react";
import { Link } from "react-router-dom";

import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

import StateContext from "../StateContext";

export default props => {
  const appState = useContext(StateContext);
  const headerContent = appState.isLoggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            MyApp
          </Link>
        </h4>
        {/* If we're using static html, staticEmpty would be true and we wouldn't render js */}
        {!props.staticEmpty ? headerContent : ""}
      </div>
    </header>
  );
};
