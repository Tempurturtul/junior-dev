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
    var containerElem = document.querySelector('.main');
    var portfolioTemplate = document.getElementById('portfolio-template')
                              .innerHTML;
    var pieceTemplate = document.getElementById('portfolio-piece-template')
                          .innerHTML;

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
      var pieces = portfolioController.getPortfolioPieces();
      pieces = pieces.map(function(piece) {
        return formatPieceTemplate(piece);
      }).join('');

      var formattedPortfolioTemplate = portfolioTemplate
        .replace('{portfolio-pieces}', pieces);
      containerElem.innerHTML = formattedPortfolioTemplate;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the portfolio view.
     */
    function init() {}

    /**
     * Formats a piece template with data from a portfolio piece.
     * @param {PortfolioPiece} piece - The portfolio piece used to format
     * the template.
     * @return {string} - The formatted template.
     */
    function formatPieceTemplate(piece) {
      var placeholderImgURL = 'images/placeholder-300.png';
      var placeholderImgAlt = 'Image unavailable.';

      // Formate piece template.
      var formattedPieceTemplate = pieceTemplate
        .replace('{title}', piece.title)
        .replace('{description}', piece.description)
        .replace('{source-url}', piece.sourceURL)
        .replace('{live-url-open}', piece.liveURL ?
                                    '<a ' +
                                        'class="portfolio-piece__live-link" ' +
                                        'href="' + piece.liveURL + '">' :
                                    '')
        .replace('{live-url-close}', piece.liveURL ?
                                     '</a>' :
                                     '')
        .replace('{img-src}', piece.image && piece.image.static ?
                              piece.image.static :
                              placeholderImgURL)
        .replace('{img-srcset}', piece.image && piece.image.responsive ?
                                 formatImgSrcset(piece.image.responsive) :
                                 '')
        .replace('{img-description}', piece.image && piece.image.alt ?
                                      piece.image.alt :
                                      placeholderImgAlt);

      return formattedPieceTemplate;
    }

    /**
     * Formats an object with image data into a srcset string.
     * @param {object[]} data - The image data.
     * @param {string} data.url - The URL for one of the images.
     * @param {string} data.width - The width of one of the images.
     * @return {string} - The srcset string.
     */
    function formatImgSrcset(data) {
      return data.reduce(function(acc, curr) {
        var set = curr.url + ' ' + curr.width;

        if (acc === '') {
          return set;
        }

        acc += ', ' + set;

        return acc;
      }, '');
    }
  }
})();
