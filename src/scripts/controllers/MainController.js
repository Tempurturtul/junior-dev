// MainController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.MainController = MainController;

  /**
   * Creates a new Main Controller.
   * @constructor
   */
  function MainController() {
    var self = this;
    // Child controllers.
    var blogController = new app.controllers.BlogController(self);
    var homeController = new app.controllers.HomeController(self);
    var portfolioController = new app.controllers.PortfolioController(self);

    self.setBlogView = setBlogView;
    self.setHomeView = setHomeView;
    self.setPortfolioView = setPortfolioView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Sets the blog view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setBlogView(params) {
      blogController.setView(params);
    }

    /**
     * Sets the home view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setHomeView(params) {
      homeController.setView(params);
    }

    /**
     * Sets the portfolio view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setPortfolioView(params) {
      portfolioController.setView(params);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the main controller.
     */
    function init() {}
  }
})();
