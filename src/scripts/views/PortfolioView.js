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
      htmlTemplate = refreshTemplate();
    }

    /**
     * Refreshes the HTML template's content.
     */
    function refreshTemplate() {
      var template = document.getElementById('portfolio-template').innerHTML;
      var portfolioPieces = portfolioController.getPortfolioPieces();

      portfolioPieces.forEach(function(piece) {
        console.log(piece);
      });
    }
  }
})();
