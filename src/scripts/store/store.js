// store.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app._store = {
    portfolioPieces: [],
    blogPosts: []
  };

  // Get JSON data for portfolio pieces and pass to updatePortfolioPieces.
  getFile('scripts/store/portfolioPieces.json', updatePortfolioPieces);
  // Get JSON data for blog posts and pass to updateBlogPosts.
  getFile('scripts/store/posts.json', updateBlogPosts);

  /**
   * Requests the file at the given url and passes the response as text to
   * the given done callback.
   * @param {string} url - The url of the file to request.
   * @param {getFileCallback} done - The callback to be passed the response as
   * text.
   */
  function getFile(url, done) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, true);
    xhr.send();

    /**
     * Handles the onreadystatechange event by invoking the done callback
     * with the response as text if the request is complete. Does not check
     * the status of the request (may pass null to the done callback).
     */
    function handleStateChange() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        done(xhr.responseText);
      }
    }
  }

  /**
   * Updates the store to contain the new portfolio piece data.
   * @callback getFileCallback
   * @param {string|null} data - Collection of portfolio piece data as a JSON
   * string, or null if no data was retrieved.
   */
  function updatePortfolioPieces(data) {
    if (!data) {
      return;
    }

    data = JSON.parse(data);
    app._store.portfolioPieces = data;
  }

  /**
   * Updates the store to contain the new blog post data.
   * @callback getFileCallback
   * @param {string|null} data - Collection of blog post data as a JSON
   * string, or null if no data was retrieved.
   */
  function updateBlogPosts(data) {
    if (!data) {
      return;
    }

    data = JSON.parse(data);

    app._store.blogPosts = data;
  }
})();
