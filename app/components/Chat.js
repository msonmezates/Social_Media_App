import React, { useState, useContext, useEffect, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

export default () => {
  const appState = useContext(StateContext);
  const appDisptach = useContext(DispatchContext);

  const inputValue = useRef(null);

  const [state, setState] = useImmer({
    inputValue: "",
    chatMessages: []
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      console.log(inputValue.current);
      inputValue.current.focus();
    }
  }, [appState.isChatOpen]);

  const handleFieldChange = e => {
    const { value } = e?.target;
    setState(draft => {
      draft.inputValue = value;
    });
  };

  useEffect(() => {
    socket.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const { username, avatar, token } = appState.user;
    // Send message to chat server
    socket.emit("chatFromBrowser", {
      message: state.inputValue,
      token
    });

    setState(draft => {
      // Add message to chatMessages array
      draft.chatMessages.push({ message: draft.inputValue, username, avatar });
      draft.inputValue = "";
    });
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          className="chat-title-bar-close"
          onClick={() => appDisptach({ type: "closeChat" })}
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log">
        {state.chatMessages.map((message, index) => {
          // if this is user typing
          if (message.username === appState.user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
          // if the other person is typing
          return (
            <div className="chat-other" key={index}>
              <a href="#">
                <img className="avatar-tiny" src={message.avatar} />
              </a>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <a href="#">
                    <strong>{message.username}:</strong>
                  </a>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        id="chatForm"
        className="chat-form border-top"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={inputValue}
          onChange={handleFieldChange}
          value={state.inputValue}
        />
      </form>
    </div>
  );
};