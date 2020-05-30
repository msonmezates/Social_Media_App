import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Page from "./Page";
import Loader from "./Loader";
import FlashMessages from "./FlashMessages";

export default () => {
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
    sendCount: 0
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
        state.sendCount++;
        break;
      case "saveRequestStarted":
        state.isSaving = true;
        break;
      case "saveRequestFinished":
        state.isSaving = false;
        break;
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(myReducer, originalState);

  const handleFormSubmit = e => {
    e.preventDefault();
    dispatch({ type: "submitRequest" });
  };

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

  if (state.isFetching) {
    return (
      <Page title="...">
        <Loader />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <form onSubmit={handleFormSubmit}>
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
          />
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
          />
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Post"}
        </button>
      </form>
    </Page>
  );
};
