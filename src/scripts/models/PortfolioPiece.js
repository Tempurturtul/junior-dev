// PortfolioPiece.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.models = app.models || {};
  app.models.PortfolioPiece = PortfolioPiece;

  /**
   * Creates a new Portfolio Piece.
   * @constructor
   * @param {object} data - Data representing the portfolio piece.
   * @param {string} data.title - The title of the piece.
   * @param {string} [data.liveURL] - A URL to a live version of the piece.
   * @param {string} [data.sourceURL] - A URL to the piece's source code.
   * @param {object[]} [data.images] - A collection of images of the portfolio
   * piece, including image size.
   * @param {string} [data.description] - A description of the piece.
   */
  function PortfolioPiece(data) {
    this.title = data.title;
    this.liveURL = data.liveURL || '';
    this.sourceURL = data.sourceURL || '';
    this.images = data.images || [];
    this.description = data.description || '';
  }
})();
