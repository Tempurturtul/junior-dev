/*
* main.js
*
* Handles initialization.
*/
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  // Add event handlers.
  window.addEventListener('load', setView);
  window.addEventListener('hashchange', setView);

  /**
   * Invokes the controller's setView method with the current
   * location hash.
   */
  function setView() {
    app.controller.setView(window.location.hash);
  }
})();
