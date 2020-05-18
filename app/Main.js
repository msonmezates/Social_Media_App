// React
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";

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
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("appToken"))
  );
  const [flashMessages, setFlashMessages] = useState([]);

  const addFlashMessage = message => {
    setFlashMessages(prev => [...prev, message]);
  };

  return (
    <BrowserRouter>
      <FlashMessages messages={flashMessages} />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Switch>
        <Route path="/" exact>
          {isLoggedIn ? <Home /> : <HomeGuest />}
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
          {isLoggedIn && <CreatePost addFlashMessage={addFlashMessage} />}
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

ReactDOM.render(<Main />, document.getElementById("app"));

// Load changes asynchronously without refreshing page
if (module.hot) {
  module.hot.accept();
}
