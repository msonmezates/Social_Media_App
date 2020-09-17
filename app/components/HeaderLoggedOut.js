import React, { useState, useContext } from "react";
import axios from "axios";
import DispatchContext from "../DispatchContext";

export default props => {
  const appDispatch = useContext(DispatchContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", {
        username,
        password
      });
      if (response?.data) {
        appDispatch({ type: "login", value: response.data });
        appDispatch({
          type: "flashMessage",
          value: "You have successfully logged in"
        });
      } else {
        appDispatch({
          type: "flashMessage",
          value: "Invalid username / password"
        });
      }
    } catch (e) {
      console.error("There was an error", e);
    }
  };

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};
