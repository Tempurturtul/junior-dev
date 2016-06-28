// app.js
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  window.addEventListener('load', init);

  /**
   * Initializes the application.
   */
  function init() {
    var mainController = new app.controllers.MainController();
    var router = new app.Router();
    // Routes to define. (A preceding colon indicates a key/value pair to be passed as a parameter.)
    var routes = [
      {route: '', handler: mainController.setBlogView},
      {route: 'blog', handler: mainController.setBlogView},
      {route: 'blog/:post', handler: mainController.setBlogView},
      {route: 'home', handler: mainController.setHomeView},
      {route: 'portfolio', handler: mainController.setPortfolioView}
    ];

    // Register the routes.
    routes.forEach(function(entry) {
      router.register(entry.route, entry.handler);
    });

    // Start the router and check the current route.
    router.start(true);
  }
})();
