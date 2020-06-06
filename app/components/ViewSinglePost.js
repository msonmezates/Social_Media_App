import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import axios from "axios";

import Page from "./Page";
import Loader from "./Loader";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const ViewSinglePost = props => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const postId = useParams().id;

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Create a cancel token
    const ourRequest = axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${postId}`, {
          cancelToken: ourRequest.token
        });
        if (response?.data) {
          setPost(response.data);
          setIsLoading(false);
        } else {
          setNotFound(true);
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

  if (notFound) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <Page title="...">
        <Loader />
      </Page>
    );
  }

  // Show icons for authorized user only
  const isOwner = () => {
    if (
      appState?.isLoggedIn &&
      appState?.user?.username === post?.author?.username
    ) {
      return true;
    }
    return false;
  };

  const handleDeletePost = async () => {
    const userResponse = window.confirm("Are you sure to delete the post");
    if (userResponse) {
      try {
        const response = await axios.delete(`/post/${post?._id}`, {
          data: {
            token: appState.user.token
          }
        });
        if (response?.data.toLowerCase() === "success") {
          // show flash message
          appDispatch({
            type: "flashMessage",
            value: "Post successfully deleted"
          });
          // redirect back to main profile page
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.error("There was an error", e);
      }
    }
  };

  const showFormattedDate = () => {
    const date = new Date(post.createdDate);
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDay()}/${date.getFullYear()}`;
    return formattedDate;
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              className="text-primary mr-2"
              data-tip="Edit"
              data-for="edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
              onClick={handleDeletePost}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {showFormattedDate()}
      </p>

      {/* Body can support markdown */}
      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem"
          ]}
        />
      </div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
