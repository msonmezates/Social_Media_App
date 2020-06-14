// React
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

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
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";

axios.defaults.baseURL = "http://localhost:8080";

const Main = () => {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("appToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("appToken") || "",
      username: localStorage.getItem("appUsername") || "",
      avatar: localStorage.getItem("appAvatar") || ""
    },
    isSearchOpen: false
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        state.isLoggedIn = true;
        state.user = action.value;
        break;
      case "logout":
        state.isLoggedIn = false;
        break;
      case "flashMessage":
        state.flashMessages.push(action.value);
        break;
      case "openSearch":
        state.isSearchOpen = true;
        break;
      case "closeSearch":
        state.isSearchOpen = false;
        break;
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("appToken", state.user.token);
      localStorage.setItem("appUsername", state.user.username);
      localStorage.setItem("appAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("appToken");
      localStorage.removeItem("appUsername");
      localStorage.removeItem("appAvatar");
    }
  }, [state.isLoggedIn]);

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
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition
            timeout={300}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
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
