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
    var aboutController = new app.controllers.AboutController(self);
    var blogController = new app.controllers.BlogController(self);
    var portfolioController = new app.controllers.PortfolioController(self);

    self.setAboutView = setAboutView;
    self.setBlogView = setBlogView;
    self.setPortfolioView = setPortfolioView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Sets the about view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setAboutView(params) {
      aboutController.setView(params);
    }

    /**
     * Sets the blog view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setBlogView(params) {
      blogController.setView(params);
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
