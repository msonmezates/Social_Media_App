import React from "react";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import { CSSTransition } from "react-transition-group";

import Page from "./Page";

export default () => {
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  };

  function myReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "Username cannot exceed 30 characters";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message = "Username cannot have special characters";
        }
        break;
      case "usernameAfterDelay":
        break;
      case "usernameUniqueResults":
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        break;
      case "emailUniqueResults":
        break;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        break;
      case "passwordAfterDelay":
        break;
      case "submitForm":
        break;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(myReducer, initialState);

  const handleSubmit = e => {
    e.preventDefault();
    // try {
    //   await axios.post("/register", {
    //     username,
    //     email,
    //     password
    //   });
    //   console.log("user was successfully created");
    // } catch (e) {
    //   console.error("There was an error", e);
    // }
  };

  return (
    <Page wide={true} title="Home">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={e =>
                  dispatch({
                    type: "usernameImmediately",
                    value: e.target.value
                  })
                }
              />
              {/* Show error message */}
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={e =>
                  dispatch({ type: "emailImmediately", value: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={e =>
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for MyApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};
