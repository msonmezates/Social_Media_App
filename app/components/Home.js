import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { useImmer } from "use-immer";
import axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Page from "./Page";
import Loader from "./Loader";

export default () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const { token } = appState.user;
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  });

  useEffect(() => {
    // Create cancel token
    const ourRequest = axios.CancelToken.source();

    // useEffect can't take async directly
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "/getHomeFeed",
          {
            token
          },
          { cancelToken: ourRequest.token }
        );
        if (response?.data) {
          setState(draft => {
            draft.isLoading = false;
            draft.feed = response.data;
          });
        }
      } catch (e) {
        console.error("There was an error or network request was cancelled", e);
      }
    };

    fetchData();

    // Cleanup function in case network request is cancelled
    return () => {
      ourRequest.cancel();
    };
  }, []);

  // Show spinner while loading page
  if (state.isLoading) {
    return <Loader />;
  }

  const handleCloseIcon = () => {
    appDispatch({ type: "closeSearch" });
  };

  return (
    <Page title="Your Feed">
      {!state.feed.length && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
      {state.feed.length && (
        <>
          <h2 className="text-center mb-4">The Latest From Those You Follow</h2>
          <div className="list-group">
            {state.feed.map(post => {
              const date = new Date(post.createdDate);
              const formattedDate = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;

              return (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="list-group-item list-group-item-action"
                  onClick={handleCloseIcon}
                >
                  <img className="avatar-tiny" src={post.author.avatar} />
                  <strong>{post.body}</strong>{" "}
                  <span className="text-muted small">
                    by {post.author.username} on {formattedDate}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </Page>
  );
};
