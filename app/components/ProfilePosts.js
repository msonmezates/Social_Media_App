import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/profile/${username}/posts`);
        if (response?.data) {
          setPosts(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("There was an error", e);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate);
        const formattedDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;

        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />
            <strong>{post.body}</strong>{" "}
            <span className="text-muted small">on {formattedDate}</span>
          </Link>
        );
      })}
    </div>
  );
};
