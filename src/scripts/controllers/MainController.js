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

    self.getStoredData = getStoredData;
    self.setAboutView = setAboutView;
    self.setBlogView = setBlogView;
    self.setPortfolioView = setPortfolioView;
    self.setQueryString = setQueryString;

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
     * Sets the query string to contain the given data.
     * @param {object} data - The keys and values in the query string.
     */
    function setQueryString(data) {
      var url = window.location.href.split('?')[0];
      var queryStr = '';

      for (var prop in data) {
        // Exclude inherited properties.
        if (data.hasOwnProperty(prop)) {
          // Add '?' for first property only, otherwise add '&'.
          if (queryStr) {
            queryStr += '&';
          } else {
            queryStr += '?';
          }

          // Convert array values to comma-separated strings.
          if (Array.isArray(data[prop])) {
            data[prop] = data[prop].join(',');
          }

          // Ignore null values and empty strings.
          if (data[prop] !== (null || '')) {
            queryStr += prop + '=' + data[prop];
          }
        }
      }

      window.location.href = url + queryStr;
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
    }
  }
})();
