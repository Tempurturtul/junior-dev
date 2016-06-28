// HomeView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.HomeView = HomeView;

  /**
   * Creates a new Home View.
   * @constructor
   * @param {HomeController} homeController - The view's controller.
   */
  function HomeView(homeController) {
    var self = this;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the home view.
     */
    function init() {}
  }
})();
