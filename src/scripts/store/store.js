// store.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  var dataList = [
    {
      url: 'scripts/store/portfolioPieces.json',
      key: 'portfolioPieces'
    },
    {
      url: 'scripts/store/posts.json',
      key: 'blogPosts'
    }
  ];
  // The number of data entries from dataList that have been retrieved and added to the store.
  var ready = 0;

  app._store = {
    ready: false
  };

  // Get JSON data from each url and pass to updateStore along with the related key.
  dataList.forEach(function(entry) {
    getFile(entry.url, storeUpdaterFor(entry.key));
  });

  /**
   * Wrapper function for the updateStore method that passes along the given
   * key argument.
   * @param {string} key - The key to pass to the updateStore method.
   * @return {function} - An anonymous wrapper function for the updateStore
   * method that takes the data argument for use in said function.
   */
  function storeUpdaterFor(key) {
    return function(data) {
      updateStore(key, data);
    };
  }

  /**
   * Updates the store with the new data and updates the store's ready state.
   * @param {string} key - The key under which to store the data.
   * @param {string|null} data - Collection of data as a JSON string, or null
   * if no data was retrieved.
   */
  function updateStore(key, data) {
    // Do nothing if there is no data.
    if (!data) {
      return;
    }

    data = JSON.parse(data);
    app._store[key] = data;

    ready++;

    if (ready === dataList.length) {
      app._store.ready = true;
    }
  }

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
})();
