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
    var filteredTags = [];

    self.getFilteredTags = getFilteredTags;
    self.getPortfolioPieces = getPortfolioPieces;
    self.setFilteredTags = setFilteredTags;
    self.setView = setView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
    * Gets the filtered tags.
    * @return {string[]} - The filtered tags.
     */
    function getFilteredTags() {
      return filteredTags;
    }

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

      pieces = filterPieces(pieces, filteredTags);
      pieces = sortPieces(pieces);

      return pieces;
    }

    /**
     * Sets the filtered tags.
     * @param {string[]} tags - The new tags.
     */
    function setFilteredTags(tags) {
      filteredTags = tags;
      portfolioView.renderPieces();
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

    /**
     * Filters pieces.
     * @param {PortfolioPiece[]} pieces - Pieces to filter.
     * @param {string[]} tags - Tags to filter by.
     * @return {Pieces[]} - Filtered pieces.
     */
    function filterPieces(pieces, tags) {
      var i;
      var tagsLen = tags.length;

      return pieces.filter(function(piece) {
        // For each filtered tag...
        for (i = 0; i < tagsLen; i++) {
          // If the piece doesn't contain the tag, exclude the piece.
          if (!piece.tags || piece.tags.indexOf(tags[i]) === -1) {
            return false;
          }
        }

        return true;
      });
    }
  }

  /**
   * Sorts portfolio pieces by date.
   * @param {PortfolioPiece[]} pieces - The pieces to sort.
   * @return {PortfolioPiece[]} - Sorted pieces.
   */
  function sortPieces(pieces) {
    // Sort by age ascending.
    pieces.sort(function(a,b) {
      // If a is younger than b, place it before b.
      if (a.date > b.date) {
        return -1;
      }
      // If a is older than b, place it after b.
      if (a.date < b.date) {
        return 1;
      }

      // Always handle undefined date by placing at beginning.
      // (Easier to notice and correct.)
      if (!a.date) {
        return -1;
      }
      if (!b.date) {
        return 1;
      }

      // If a and b are the same age, no change.
      return 0;
    });

    return pieces;
  }
})();
