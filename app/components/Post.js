import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { post, onClick, noAuthor } = props;
  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Link
      className="list-group-item list-group-item-action"
      to={`/post/${post._id}`}
      onClick={onClick}
    >
      <img className="avatar-tiny" src={post.author.avatar} />
      <strong>{post.body}</strong>{" "}
      <span className="text-muted small">
        {!noAuthor && `by ${post.author.username} `}
        on {formattedDate}
      </span>
    </Link>
  );
};
