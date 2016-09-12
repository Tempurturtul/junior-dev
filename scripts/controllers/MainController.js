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
    var store = app._store;
    // Child controllers. (Assigned during initialization.)
    var aboutController;
    var blogController;
    var portfolioController;
    var contactController;
    var attributionsController;

    self.getStoredData = getStoredData;
    self.setAboutView = setAboutView;
    self.setBlogView = setBlogView;
    self.setPortfolioView = setPortfolioView;
    self.setContactView = setContactView;
    self.setAttributionsView = setAttributionsView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Gets stored data.
     * @param {string} [key] - The key to use when getting data. If
     * undefined, gets all data.
     * @return {*} - The data.
     */
    function getStoredData(key) {
      if (key) {
        return store[key];
      }

      return store;
    }

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

    /**
     * Sets the contact view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setContactView(params) {
      contactController.setView(params);
    }

    /**
     * Sets the attributions view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setAttributionsView(params) {
      attributionsController.setView(params);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the main controller.
     */
    function init() {
      aboutController = new app.controllers.AboutController(self);
      blogController = new app.controllers.BlogController(self);
      portfolioController = new app.controllers.PortfolioController(self);
      contactController = new app.controllers.ContactController(self);
      attributionsController = new app.controllers.AttributionsController(self);
    }
  }
})();
