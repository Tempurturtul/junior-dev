// PortfolioController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.PortfolioController = PortfolioController;

  /**
   * Creates a new Portfolio Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function PortfolioController(mainController) {
    var self = this;
    var portfolioView = new app.views.PortfolioView(self);

    self.setView = setView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      console.log(params);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the portfolio controller.
     */
    function init() {}
  }
})();
