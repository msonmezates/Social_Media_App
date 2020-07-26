import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import axios from "axios";

import Loader from "./Loader";
import Post from "./Post";

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    // Create a cancel token
    const ourRequest = axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token
        });
        if (response?.data) {
          setPosts(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("There was an error or network request was cancelled", e);
      }
    };
    fetchPosts();

    // Cleanup function in case network request is cancelled
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <Loader />;

  return (
    <div className="list-group">
      {posts.map(post => (
        <Post key={post._id} post={post} noAuthor={true} />
      ))}
    </div>
  );
};
