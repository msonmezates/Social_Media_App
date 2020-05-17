import React from "react";

export default props => {
  const handleLogOut = () => {
    props.setIsLoggedIn(false);
    props.setIsLoggedIn(localStorage.removeItem("appToken"));
    props.setIsLoggedIn(localStorage.removeItem("appUsername"));
    props.setIsLoggedIn(localStorage.removeItem("appAvatar"));
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-2">
        <img
          className="small-header-avatar"
          src={localStorage.getItem("appAvatar")}
        />
      </a>
      <a className="btn btn-sm btn-success mr-2" href="/create-post">
        Create Post
      </a>
      <button className="btn btn-sm btn-secondary" onClick={handleLogOut}>
        Sign Out
      </button>
    </div>
  );
};
