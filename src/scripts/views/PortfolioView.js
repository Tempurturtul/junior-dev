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
    var containerElem = document.getElementById('main');
    var portfolioTemplate = document.getElementById('portfolio-template')
                              .innerHTML;
    var pieceTemplate = document.getElementById('portfolio-piece-template')
                          .innerHTML;
    var previewTemplate = document
      .getElementById('portfolio-piece-preview-template').innerHTML;
    var sourceTemplate = document
      .getElementById('portfolio-piece-source-template').innerHTML;
    var tagTemplate = document.getElementById('portfolio-piece-tag-template')
                        .innerHTML;
    var tagFilterTemplate = document.getElementById('tag-filter-template')
                              .innerHTML;
    // Initialized on render.
    var pieceContainerElem;
    var tagFilterContainerElem;

    self.render = render;
    self.renderTagFilters = renderTagFilters;
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
      tagFilterContainerElem = document.querySelector('.tag-filters__filters');
      renderTagFilters();
      renderPieces();
    }

    /**
     * Renders tag filters.
     */
    function renderTagFilters() {
      // Get all tags.
      var tags = portfolioController.getAllTags();
      // Get filtered tags.
      var filtered = portfolioController.getFilteredTags();

      // Convert tags to a single string of formatted tag filter templates.
      tags = tags.map(function(tag) {
        return tagFilterTemplate
          .replace('{tag-value}', tag)
          .replace('{tag}', tag)
          .replace('{checked}', filtered.indexOf(tag) === -1 ?
                                '' :
                                'checked');
      })
      .join('');

      tagFilterContainerElem.innerHTML = tags;

      // Add event listeners.
      var checkboxes = document.getElementsByClassName('tag-filters__checkbox');
      var len = checkboxes.length;
      // For each checkbox...
      for (var i = 0; i < len; i++) {
        // Add the handleTagFilterChange event listener.
        checkboxes[i].addEventListener('change', handleTagFilterChange);
      }
      var filtersResetBtn = document
        .querySelector('.tag-filters__reset-btn');
      filtersResetBtn.addEventListener('click', handleFiltersResetClick);
    }

    /**
     * Renders portfolio pieces.
     */
    function renderPieces() {
      var pieces = portfolioController.getPortfolioPieces();
      var filteredTags = portfolioController.getFilteredTags();

      // Convert pieces to a single string of formatted piece templates.
      pieces = pieces.map(function(piece) {
        return formatPieceTemplate(piece, filteredTags);
      }).join('');

      pieceContainerElem.innerHTML = pieces;

      // Add event listeners.
      var tags = document.getElementsByClassName('portfolio-piece__tag');
      var len = tags.length;
      // For each tag...
      for (var i = 0; i < len; i++) {
        // Add the handleTagClick event listener.
        tags[i].addEventListener('click', handleTagClick);
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
     * @param {string[]} activeTags - The currently active tags.
     * @return {string} - The formatted template.
     */
    function formatPieceTemplate(piece, activeTags) {
      // Formate piece template.
      var formattedPieceTemplate = pieceTemplate
        .replace('{title}', formatPieceTitle(piece.title,
                                             piece.sourceURL,
                                             piece.liveURL))
        .replace('{date}', piece.date ? formatPieceDate(piece.date) : '')
        .replace('{iso-date}', piece.date ? piece.date.toISOString() : '')
        .replace('{description}', piece.description || '')
        .replace('{preview}', formatPreviewTemplate(piece))
        .replace('{source}', piece.sourceURL ?
                             sourceTemplate.replace('{url}', piece.sourceURL) :
                             '')
        .replace('{tags}', piece.tags ?
                           formatTagTemplates(piece.tags, activeTags) :
                           '');

      return formattedPieceTemplate;
    }

    /**
     * Formats a portfolio piece title by returning the title wrapped in
     * a link if one of sourceURL or liveURL is defined. If both are
     * defined, the title is wrapped in the live URL.
     * @param {string} title - The portfolio piece title.
     * @param {string} sourceURL - The portfolio piece source URL.
     * @param {string} liveURL - The portfolio piece live URL.
     * @return {string} - The formatted title.
     */
    function formatPieceTitle(title, sourceURL, liveURL) {
      // Prefer to wrap in live URL.
      if (liveURL) {
        title = '<a class="portfolio-piece__title-link link" ' +
                    'href="' + liveURL + '">' + title + '</a>';
      } else if (sourceURL) {
        title = '<a class="portfolio-piece__title-link link" ' +
                    'href="' + sourceURL + '">' + title + '</a>';
      }

      return title;
    }

    /**
     * Formats a portfolio piece date by returning the returning the month
     * and year as a string. (For example: "January 2015")
     * @param {Date} date - The portfolio piece date.
     * @return {string} - The formatted date.
     */
    function formatPieceDate(date) {
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      return months[date.getMonth()] + ' ' + date.getFullYear();
    }

    /**
     * Formats a portfolio piece preview tempate.
     * @param {Piece} piece - A portfolio piece.
     * @return {string} - The formatted template as an HTML string.
     */
    function formatPreviewTemplate(piece) {
      var placeholderImgURL = 'images/placeholder-300.png';
      var placeholderImgAlt = 'Image unavailable.';

      return previewTemplate
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
        .replace('{img-description}', piece.image && piece.image.description ?
                                      piece.image.description :
                                      placeholderImgAlt);
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
        var set = curr.url + ' ' + curr.width + 'w';

        if (acc === '') {
          return set;
        }

        acc += ', ' + set;

        return acc;
      }, '');
    }

    /**
    * Formats a tag template for each tag.
    * @param {string[]} tags - The tags.
    * @param {string[]} activeTags - Array of active tags.
    * @return {string} - The formatted tag templates as a single HTML string.
    */
    function formatTagTemplates(tags, activeTags) {
      return tags
        .map(function(tag) {
          return tagTemplate
            .replace('{tag}', tag)
            .replace('{active}', activeTags.indexOf(tag) === -1 ?
                                 '' :
                                 'tag--active');
        })
        .join('');
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

    /**
     * Handles tag filter change event by updating the portfolio controller's
     * filtered tags.
     * @param {Event} e - The change event.
     */
    function handleTagFilterChange(e) {
      var tag = e.target.value;
      var checked = e.target.checked;
      // Get filtered tags.
      var filteredTags = portfolioController.getFilteredTags();
      // Add or remove the clicked tag from the filtered tags.
      if (checked && filteredTags.indexOf(tag) === -1) {
        filteredTags.push(tag);
      } else if (!checked && filteredTags.indexOf(tag) !== -1) {
        filteredTags.splice(filteredTags.indexOf(tag), 1);
      }
      // Update the filtered tags.
      portfolioController.setFilteredTags(filteredTags);
    }

    /**
     * Handles the filters reset click event by clearing all filtered tags.
     * @param {Event} e - The click event.
     */
    function handleFiltersResetClick(e) {
      var filteredTags = portfolioController.getFilteredTags();

      // Only do something if there are filtered tags.
      if (filteredTags.length) {
        // Set the filtered tags to an empty array.
        portfolioController.setFilteredTags([]);
      }
    }
  }
})();
