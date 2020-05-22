import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Page from "./Page";
import axios from "axios";

export default () => {
  const postId = useParams().id;

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${postId}`);
        console.log(response.data);
        if (response?.data) {
          setPost(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Something went wrong", e);
      }
    };
    fetchPost();
  }, []);

  if (isLoading) {
    return (
      <Page title="...">
        <div>Loading...</div>
      </Page>
    );
  }

  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDay()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {formattedDate}
      </p>

      <div className="body-content">{post.body}</div>
    </Page>
  );
};
