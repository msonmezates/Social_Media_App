import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext";
import axios from "axios";

export default () => {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  });

  // Handle keyboard events
  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    // Cleanup
    return () => {
      document.removeEventListener("keyup", searchKeyPressHandler);
    };
  }, []);

  // Handle search
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++;
        });
      }, 3000);

      // Cleanup to handle api call
      // Don't make api call for every single character user types
      return () => clearTimeout(delay);
    } else {
      setState(draft => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  // Handle api call based on count
  useEffect(() => {
    if (state.requestCount) {
      // Create a cancel token
      const myRequest = axios.CancelToken.source();

      const fetchSearchResults = async () => {
        try {
          const response = await axios.post(
            "/search",
            {
              searchTerm: state.searchTerm
            },
            {
              cancelToken: myRequest.token
            }
          );

          if (response?.data) {
            setState(draft => {
              draft.results = response.data;
              draft.show = "results";
            });
          }
        } catch (e) {
          console.error("Something went wrong", e);
        }
      };
      fetchSearchResults();

      // Clean up function
      return () => myRequest.cancel();
    }
  }, [state.requestCount]);

  const searchKeyPressHandler = e => {
    if (e.code === "Escape" || e.keyCode === 27) {
      appDispatch({ type: "closeSearch" });
    }
  };

  const handleCloseIcon = () => {
    appDispatch({ type: "closeSearch" });
  };

  const handleInputSearch = e => {
    const value = e?.target?.value;
    setState(draft => {
      draft.searchTerm = value;
    });
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInputSearch}
          />
          <span className="close-live-search" onClick={handleCloseIcon}>
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show === "results" ? "live-search-results--visible" : "")
            }
          >
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> (30 items found)
              </div>
              <a href="#" className="list-group-item list-group-item-action">
                <img
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #1</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
