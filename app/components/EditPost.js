import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import axios from "axios";

import Page from "./Page";
import Loader from "./Loader";

export default () => {
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
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(myReducer, originalState);

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

  if (state.isFetching) {
    return (
      <Page title="...">
        <Loader />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <form>
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
            value={state.title}
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
            value={state.body}
          />
        </div>

        <button className="btn btn-primary">Save Post</button>
      </form>
    </Page>
  );
};
