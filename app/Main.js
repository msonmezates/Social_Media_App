// React
import React, { useEffect, Suspense } from "react";
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
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Loader from "./components/Loader";
// Lazy loading
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

axios.defaults.baseURL = process.env.BACKEND_URL || "";

const Main = () => {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("appToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("appToken") || "",
      username: localStorage.getItem("appUsername") || "",
      avatar: localStorage.getItem("appAvatar") || ""
    },
    isSearchOpen: false,
    isChatOpen: false,
    unReadChatCount: 0
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
      case "toggleChat":
        state.isChatOpen = !state.isChatOpen;
        break;
      case "closeChat":
        state.isChatOpen = false;
        break;
      case "incrementUnreadChatCount":
        state.unReadChatCount++;
        break;
      case "clearUnreadChatCount":
        state.unReadChatCount = 0;
        break;
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // Check if token has expired on first render
  useEffect(() => {
    if (state.isLoggedIn) {
      // Create a cancel token
      const myRequest = axios.CancelToken.source();

      const fetchSearchResults = async () => {
        try {
          const response = await axios.post(
            "/checkToken",
            {
              token: state.user.token
            },
            {
              cancelToken: myRequest.token
            }
          );
          if (!response?.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "Your session has expired. Please log in again..."
            });
          }
        } catch (e) {
          console.error("Something went wrong", e);
        }
      };
      fetchSearchResults();

      // Clean up function
      return () => myRequest.cancel();
    }
  }, []);

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
          <Suspense fallback={<Loader />}>
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
          </Suspense>
          <CSSTransition
            timeout={300}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.isLoggedIn && <Chat />}</Suspense>
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
