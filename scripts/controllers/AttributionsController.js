// AttributionsController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.AttributionsController = AttributionsController;

  /**
   * Creates a new Attributions Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function AttributionsController(mainController) {
    var self = this;
    // Assigned during initialization.
    var attributionsView;

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
      attributionsView.render();
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the attributions controller.
     */
    function init() {
      attributionsView = new app.views.AttributionsView(self);
    }
  }
})();
