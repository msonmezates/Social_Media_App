import React, { useEffect } from "react";
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
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Username must be at least 3 characters";
        }
        if (!draft.hasErrors) {
          draft.username.checkCount++;
        }
        break;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "You must provide a valid email address";
        }
        if (!draft.email.hasErrors) {
          draft.email.checkCount++;
        }
        break;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already taken";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Password cannot exceed 50 characters";
        }
        break;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password cannot be less than 12 characters";
        }
        break;
      case "submitForm":
        break;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(myReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  // Handle api call based on username check count
  useEffect(() => {
    if (state.username.checkCount) {
      // Create a cancel token
      const myRequest = axios.CancelToken.source();

      const fetchSearchResults = async () => {
        try {
          const response = await axios.post(
            "/doesUsernameExist",
            {
              username: state.username.value
            },
            {
              cancelToken: myRequest.token
            }
          );

          if (response?.data) {
            dispatch({ type: "usernameUniqueResults", value: response.data });
          }
        } catch (e) {
          console.error("Something went wrong", e);
        }
      };
      fetchSearchResults();

      // Clean up function
      return () => myRequest.cancel();
    }
  }, [state.username.checkCount]);

  // Handle api call based on email check count
  useEffect(() => {
    if (state.email.checkCount) {
      // Create a cancel token
      const myRequest = axios.CancelToken.source();

      const fetchSearchResults = async () => {
        try {
          const response = await axios.post(
            "/doesEmailExist",
            {
              email: state.email.value
            },
            {
              cancelToken: myRequest.token
            }
          );

          if (response?.data) {
            dispatch({ type: "emailUniqueResults", value: response.data });
          }
        } catch (e) {
          console.error("Something went wrong", e);
        }
      };
      fetchSearchResults();

      // Clean up function
      return () => myRequest.cancel();
    }
  }, [state.email.checkCount]);

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
              {/* Show error message */}
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
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
              {/* Show error message */}
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
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
