// HomeController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.HomeController = HomeController;

  /**
   * Creates a new Home Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function HomeController(mainController) {
    var self = this;
    var homeView = new app.views.HomeView(self);

    self.setView = setView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      console.log(params);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the home controller.
     */
    function init() {}
  }
})();
