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

    self.refresh = refresh;
    self.render = render;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Refreshes the view (but does not render).
     * @param {object} data - Data used to refresh the view.
     * @param {PortfolioPiece[]} data.portfolioPieces - Portfolio pieces to
     * display in the view.
     */
    function refresh(data) {
      var pieces = data.portfolioPieces
        .map(function(piece) {
          return formatPieceTemplate(piece);
        })
        .join('');

      htmlTemplate = document.getElementById('portfolio-template').innerHTML;
      htmlTemplate = htmlTemplate.replace('{portfolio-pieces}', pieces);
    }

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
      var data = {
        portfolioPieces: portfolioController.getPortfolioPieces()
      };
      refresh(data);
    }

    /**
     * Formats a piece template with data from a portfolio piece.
     * @param {PortfolioPiece} piece - The portfolio piece used to format
     * the template.
     * @return {string} - The formatted template.
     */
    function formatPieceTemplate(piece) {
      var template = document
                       .getElementById('portfolio-piece-template')
                       .innerHTML;
      var placeholderImgURL = 'images/placeholder.png';
      var placeholderImgAlt = 'Image unavailable.';

      // Formate piece template.
      template = template
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

      return template;
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
