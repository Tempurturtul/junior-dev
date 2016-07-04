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
   * @param {string} data.description - A description of the piece.
   * @param {string} data.sourceURL - A URL to the piece's source code.
   * @param {string} [data.liveURL] - A URL to a live version of the piece.
   * @param {object} [data.image] - Data for an image of the piece.
   * @param {string} [data.image.static] - A URL to the static image.
   * @param {object[]} [data.image.responsive] - A collection of URLs and
   * widths for a the responsive image.
   * @param {string} [data.image.responsive.url] - A URL to the responsive
   * image.
   * @param {string} [data.image.responsive.width] - A width for the
   * responsive image.
   * @param {string} [data.image.description] - A description of the image.
   */
  function PortfolioPiece(data) {
    this.title = data.title;
    this.description = data.description;
    this.sourceURL = data.sourceURL;
    this.liveURL = data.liveURL || null;
    this.image = data.image || null;
  }
})();
