// app.js
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  // Invoke init on load.
  window.addEventListener('load', init);

  /**
   * Initializes the application.
   */
  function init() {
    // Make sure store is ready.
    if (app._store.ready) {
      var mainController = new app.controllers.MainController(app._store);
      var router = new app.Router();
      // Routes to define. (A preceding colon indicates a key/value pair to be passed as a parameter.)
      var routes = [
        {route: '', handler: mainController.setAboutView},
        {route: 'about', handler: mainController.setAboutView},
        {route: 'blog', handler: mainController.setBlogView},
        {route: 'blog/:post', handler: mainController.setBlogView},
        {route: 'portfolio', handler: mainController.setPortfolioView},
        {route: 'contact', handler: mainController.setContactView},
        {route: 'attributions', handler: mainController.setAttributionsView}
      ];

      // Register the routes.
      routes.forEach(function(entry) {
        router.register(entry.route, entry.handler);
      });

      // Start the router and check the current route.
      router.start(true);
    } else {
      // Run init as soon as the store is ready.
      app._store.onready = init;
    }
  }
})();
