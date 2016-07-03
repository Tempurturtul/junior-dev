// AboutController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.AboutController = AboutController;

  /**
   * Creates a new About Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function AboutController(mainController) {
    var self = this;
    var aboutView = new app.views.AboutView(self);

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
      aboutView.render();
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the about controller.
     */
    function init() {}
  }
})();
