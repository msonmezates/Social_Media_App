import React from "react";

export default ({ messages }) => {
  return (
    <div className="floating-alerts">
      {messages.map((message, index) => {
        return (
          <div
            key={index}
            className="alert alert-success text-center floating-alert shadow sm"
          >
            {message}
          </div>
        );
      })}
    </div>
  );
};
