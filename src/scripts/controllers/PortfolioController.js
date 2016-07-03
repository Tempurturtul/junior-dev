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
    // Assigned during initialization.
    var portfolioView;

    self.getPortfolioPieces = getPortfolioPieces;
    self.setView = setView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Gets portfolio pieces.
     * @return {PortfolioPiece[]} - An array of portfolio pieces.
     */
    function getPortfolioPieces() {
      var pieces = mainController.getStoredData('portfolioPieces');

      pieces = pieces
        .map(function(piece) {
          return new app.models.PortfolioPiece(piece);
        });

      return pieces;
    }

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      portfolioView.render();
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the portfolio controller.
     */
    function init() {
      portfolioView = new app.views.PortfolioView(self);
    }
  }
})();
