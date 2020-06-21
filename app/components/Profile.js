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
    followActionLoading: false,
    startFollowingRequestCount: 0,
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
  }, [username]);

  // Handle start following api call
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      // Disable follow button until getting response from api
      setState(draft => {
        draft.followActionLoading = true;
      });

      // Create cancel token
      const ourRequest = axios.CancelToken.source();

      // useEffect can't take async directly
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token
            },
            { cancelToken: ourRequest.token }
          );
          if (response?.data) {
            setState(draft => {
              draft.profileData.isFollowing = true;
              draft.profileData.counts.followerCount++;
              draft.followActionLoading = false;
            });
          }
        } catch (e) {
          console.error(
            "There was an error or network request was cancelled",
            e
          );
        }
      };

      fetchData();

      // Cleanup function in case network request is cancelled
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  // Handle stop following api call
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      // Disable follow button until getting response from api
      setState(draft => {
        draft.followActionLoading = true;
      });

      // Create cancel token
      const ourRequest = axios.CancelToken.source();

      // useEffect can't take async directly
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token
            },
            { cancelToken: ourRequest.token }
          );
          if (response?.data) {
            setState(draft => {
              draft.profileData.isFollowing = false;
              draft.profileData.counts.followerCount--;
              draft.followActionLoading = false;
            });
          }
        } catch (e) {
          console.error(
            "There was an error or network request was cancelled",
            e
          );
        }
      };

      fetchData();

      // Cleanup function in case network request is cancelled
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  const handleStartFollowing = () => {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  };

  const handleStopFollowing = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  };

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}
        {appState.isLoggedIn &&
          !state.profileData.isFollowing &&
          state.profileData.profileUsername &&
          state.profileData.profileUsername !== appState.user.username && (
            <button
              className="btn btn-primary btn-sm ml-2"
              onClick={handleStartFollowing}
              disabled={state.followActionLoading}
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.isLoggedIn &&
          state.profileData.isFollowing &&
          state.profileData.profileUsername &&
          state.profileData.profileUsername !== appState.user.username && (
            <button
              className="btn btn-danger btn-sm ml-2"
              onClick={handleStopFollowing}
              disabled={state.followActionLoading}
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
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
