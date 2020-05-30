import React, { useEffect, useContext } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Page from "./Page";
import Loader from "./Loader";
import FlashMessages from "./FlashMessages";
import NotFound from "./NotFound";

const EditPost = props => {
  const context = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  };

  const myReducer = (state, action) => {
    switch (action.type) {
      case "fetchComplete":
        state.title.value = action.value.title;
        state.body.value = action.value.body;
        state.isFetching = false;
        break;
      case "titleChange":
        state.title.value = action.value;
        break;
      case "bodyChange":
        state.body.value = action.value;
        break;
      case "submitRequest":
        if (!state.title.hasErrors && !state.body.hasErrors) {
          state.sendCount++;
        }
        break;
      case "saveRequestStarted":
        state.isSaving = true;
        break;
      case "saveRequestFinished":
        state.isSaving = false;
        break;
      case "titleValidation":
        if (!action.value.trim()) {
          state.title.hasErrors = true;
          state.title.message = "Title cannot be empty!";
        } else {
          state.title.hasErrors = false;
        }
        break;
      case "bodyValidation":
        if (!action.value.trim()) {
          state.body.hasErrors = true;
          state.body.message = "Body cannot be empty!";
        } else {
          state.body.hasErrors = false;
        }
        break;
      case "notFound":
        state.notFound = true;
        break;
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(myReducer, originalState);

  const handleFormSubmit = e => {
    e.preventDefault();
    dispatch({ type: "titleValidation", value: state.title.value });
    dispatch({ type: "bodyValidation", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  // initial load
  useEffect(() => {
    // Create a cancel token
    const ourRequest = axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token
        });
        if (response?.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          // handle if user isn't authorized
          if (response.data?.author?.username !== context.user.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to edit the post"
            });
            // redirect to homepage
            props.history.push("/");
          }
        } else {
          // if id doesn't exist
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.error("Something went wrong or the request was cancelled", e);
      }
    };
    fetchPost();

    // This return statement is for cleanup
    return () => {
      ourRequest.cancel();
    };
  }, []);

  // update form request
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });

      // Create a cancel token
      const ourRequest = axios.CancelToken.source();

      const fetchPost = async () => {
        try {
          const response = await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: context.user.token
            },
            {
              cancelToken: ourRequest.token
            }
          );
          if (response?.data) {
            dispatch({ type: "saveRequestFinished" });
            appDispatch({ type: "flashMessage", value: "Post Updated" });
            <FlashMessages messages={context.FlashMessages} />;
          }
        } catch (e) {
          console.error("Something went wrong or the request was cancelled", e);
        }
      };
      fetchPost();

      // This return statement is for cleanup
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) {
    return (
      <Page title="...">
        <Loader />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; View Post
      </Link>
      <form onSubmit={handleFormSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={e =>
              dispatch({ type: "titleChange", value: e?.target?.value })
            }
            onBlur={e =>
              dispatch({ type: "titleValidation", value: e?.target?.value })
            }
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={e =>
              dispatch({ type: "bodyChange", value: e?.target?.value })
            }
            onBlur={e =>
              dispatch({ type: "bodyValidation", value: e?.target?.value })
            }
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Post"}
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
