import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import Loader from "./Loader";

export default props => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  const { action } = props;

  useEffect(() => {
    // Create a cancel token
    const ourRequest = axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const queryParam = action === "followers" ? "followers" : "following";
        const response = await axios.get(`/profile/${username}/${queryParam}`, {
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
      {posts.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} />
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
};
