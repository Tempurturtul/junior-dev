// MainController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.MainController = MainController;

  /**
   * Creates a new Main Controller.
   * @constructor
   * @param {Object} store - The data store.
   */
  function MainController(store) {
    var self = this;
    // Child controllers. (Assigned during initialization.)
    var aboutController;
    var blogController;
    var portfolioController;
    var contactController;
    var attributionsController;
    // Pages used to update page header.
    var pages = {
      ABOUT: 'about',
      BLOG: 'blog',
      PORTFOLIO: 'portfolio',
      CONTACT: 'contact',
      ATTRIBUTIONS: 'attributions'
    };

    self.getStoredData = getStoredData;
    self.setAboutView = setAboutView;
    self.setBlogView = setBlogView;
    self.setPortfolioView = setPortfolioView;
    self.setContactView = setContactView;
    self.setAttributionsView = setAttributionsView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Gets stored data.
     * @param {string} [key] - The key to use when getting data. If
     * undefined, gets all data.
     * @return {*} - The data.
     */
    function getStoredData(key) {
      if (key) {
        return store[key];
      }

      return store;
    }

    /**
     * Sets the about view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setAboutView(params) {
      updatePageHeader(pages.ABOUT);
      aboutController.setView(params);
    }

    /**
     * Sets the blog view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setBlogView(params) {
      updatePageHeader(pages.BLOG);
      blogController.setView(params);
    }

    /**
     * Sets the portfolio view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setPortfolioView(params) {
      updatePageHeader(pages.PORTFOLIO);
      portfolioController.setView(params);
    }

    /**
     * Sets the contact view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setContactView(params) {
      updatePageHeader(pages.CONTACT);
      contactController.setView(params);
    }

    /**
     * Sets the attributions view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setAttributionsView(params) {
      updatePageHeader(pages.ATTRIBUTIONS);
      attributionsController.setView(params);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the main controller.
     */
    function init() {
      aboutController = new app.controllers.AboutController(self);
      blogController = new app.controllers.BlogController(self);
      portfolioController = new app.controllers.PortfolioController(self);
      contactController = new app.controllers.ContactController(self);
      attributionsController = new app.controllers.AttributionsController(self);
    }

    /**
     * Updates the page header.
     * @param {string} page - The current page.
     */
    function updatePageHeader(page) {
      // Update links to reflect current page.

      var links = document.getElementsByClassName('page-header__link');
      var i;
      // For each link...
      for (i = 0; i < links.length; i++) {
        // If the link points to the current page...
        if (links[i].href.split('#')[1] === '/' + page) {
          // Add the --current css modifier.
          links[i].classList.add('page-header__link--current');
        } else {
          // Remove the --current css modifier if present.
          links[i].classList.remove('page-header__link--current');
        }
      }
    }
  }
})();
