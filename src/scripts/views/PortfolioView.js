// PortfolioView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.PortfolioView = PortfolioView;

  /**
   * Creates a new Portfolio View.
   * @constructor
   * @param {PortfolioController} portfolioController - The view's controller.
   */
  function PortfolioView(portfolioController) {
    var self = this;
    var htmlTemplate;

    self.render = render;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Renders HTML to the document.
     */
    function render() {
      // Get the element in which to render content.
      var el = document.querySelector('.main');
      // Set the element's content.
      el.innerHTML = htmlTemplate;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the portfolio view.
     */
    function init() {
      refresh();
    }

    /**
     * Refreshes the view (but does not render).
     */
    function refresh() {
      var pieces = portfolioController.getPortfolioPieces();

      pieces = pieces
        .map(function(piece) {
          return formatPieceTemplate(piece);
        })
        .join('');

      htmlTemplate = document.getElementById('portfolio-template').innerHTML;
      htmlTemplate = htmlTemplate.replace('{portfolio-pieces}', pieces);
    }

    /**
     * Formats a piece template with data from a portfolio piece.
     * @param {PortfolioPiece} piece - The portfolio piece used to format
     * the template.
     * @return {string} - The formatted template.
     */
    function formatPieceTemplate(piece) {
      var pieceTemplate = document
                            .getElementById('portfolio-piece-template')
                            .innerHTML;

      pieceTemplate = pieceTemplate
        .replace('{title}', piece.title)
        .replace('{img-src}', piece.image.static)
        .replace('{img-srcset}', formatImgSrcset(piece.image.responsive))
        .replace('{img-description}', piece.image.alt)
        .replace('{github-link}', piece.sourceURL)
        .replace('{description}', piece.description);

      return pieceTemplate;

      /**
       * Formats an object with image data into a srcset string.
       * @param {object[]} data - The image data.
       * @param {string} data.url - The URL for one of the images.
       * @param {string} data.width - The width of one of the images.
       * @return {string} - The srcset string.
       */
      function formatImgSrcset(data) {

      }
    }
  }
})();
