// React
import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import axios from "axios";

// Context API
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

axios.defaults.baseURL = "http://localhost:8080";

const Main = () => {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("appToken")),
    flashMessages: []
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "login":
        state.isLoggedIn = true;
        break;
      case "logout":
        state.isLoggedIn = false;
        break;
      case "flashMessage":
        state.flashMessages.push(action.value);
        break;
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.isLoggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route path="/create-post">
              {state.isLoggedIn && <CreatePost />}
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<Main />, document.getElementById("app"));

// Load changes asynchronously without refreshing page
if (module.hot) {
  module.hot.accept();
}
