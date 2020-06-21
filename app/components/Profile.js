import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { useImmer } from "use-immer";

import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import StateContext from "../StateContext";

export default () => {
  const appState = useContext(StateContext);
  const { token } = appState.user;
  const { username } = useParams();

  const [state, setState] = useImmer({
    followActionLoadingFalse: false,
    startFollowingRequestcount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: {
        postCount: 0,
        followerCount: 0,
        followingCount: 0
      }
    }
  });

  useEffect(() => {
    // Create cancel token
    const ourRequest = axios.CancelToken.source();

    // useEffect can't take async directly
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          {
            token
          },
          { cancelToken: ourRequest.token }
        );
        if (response?.data) {
          setState(draft => {
            draft.profileData = response.data;
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

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}
        <button
          className="btn btn-primary btn-sm ml-2"
          onClick={() => console.log("following")}
        >
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
};
