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
    // Initialized on render.
    var pieceContainerElem;

    self.render = render;
    self.renderPieces = renderPieces;

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
      containerElem.innerHTML = portfolioTemplate;
      pieceContainerElem = document.querySelector('.portfolio-pieces');
      renderPieces();
    }

    /**
     * Renders portfolio pieces.
     */
    function renderPieces() {
      var pieces = portfolioController.getPortfolioPieces();
      var filteredTags = portfolioController.getFilteredTags();

      // Convert pieces to a single string of formatted piece templates.
      pieces = pieces.map(function(piece) {
        return formatPieceTemplate(piece);
      }).join('');

      pieceContainerElem.innerHTML = pieces;

      // Add event listeners.
      var tags = document.getElementsByClassName('portfolio-piece__tag');
      var len = tags.length;
      // For each tag...
      for (var i = 0; i < len; i++) {
        // Add the handleTagClick event listener.
        tags[i].addEventListener('click', handleTagClick);
        // Add the --active modifier if the tag is present in the filtered
        // tags.
        if (filteredTags.indexOf(tags[i].textContent) !== -1) {
          tags[i].classList.add('tag--active');
        }
      }
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
        .replace('{title}', piece.title || '')
        .replace('{description}', piece.description || '')
        .replace('{source-url}', piece.sourceURL ?
                                 '<a ' +
                                 'class="portfolio-piece__source-link link" ' +
                                 'href="' + piece.sourceURL + '">GitHub</a>' :
                                 '')
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
                                      placeholderImgAlt)
        .replace('{tags}', piece.tags ?
          piece.tags.map(function(tag) {
            return '<span class="portfolio-piece__tag tag">' + tag + '</span>';
          }).join(', ') :
          '');

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

    /**
     * Handles tag click event by updating the portfolio controller's
     * filtered tags.
     * @param {Event} e - The click event.
     */
    function handleTagClick(e) {
      var clickedTag = e.target.textContent;
      // Get filtered tags.
      var filteredTags = portfolioController.getFilteredTags();
      // Add or remove the clicked tag from the filtered tags.
      if (filteredTags.indexOf(clickedTag) === -1) {
        filteredTags.push(clickedTag);
      } else {
        filteredTags.splice(filteredTags.indexOf(clickedTag), 1);
      }
      // Update the filtered tags.
      portfolioController.setFilteredTags(filteredTags);
    }
  }
})();
