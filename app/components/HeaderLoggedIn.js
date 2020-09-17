import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactToolTip from "react-tooltip";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

export default props => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleLogOut = () => {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "You have successfully logged out"
    });
  };

  const handleSearchIcon = e => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        href="#"
        className="text-white mr-2 header-search-icon"
        data-tip="Search"
        data-for="search"
        onClick={handleSearchIcon}
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactToolTip id="search" place="bottom" className="custom-tooltip" />{" "}
      <span
        className={
          "mr-2 header-chat-icon " +
          (appState.unReadChatCount ? "text-danger" : "text-white")
        }
        data-tip="Chat"
        data-for="chat"
        onClick={() => appDispatch({ type: "toggleChat" })}
      >
        <i className="fas fa-comment"></i>
        {appState.unReadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unReadChatCount < 10 ? appState.unReadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactToolTip id="chat" place="bottom" className="custom-tooltip" />{" "}
      <Link
        to={`/profile/${appState.user.username}`}
        className="mr-2"
        data-tip="My Profile"
        data-for="profile"
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactToolTip id="profile" place="bottom" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button className="btn btn-sm btn-secondary" onClick={handleLogOut}>
        Sign Out
      </button>
    </div>
  );
};
