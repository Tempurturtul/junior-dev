// ContactController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.ContactController = ContactController;

  /**
   * Creates a new Contact Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function ContactController(mainController) {
    var self = this;
    // Assigned during initialization.
    var contactView;

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
      contactView.render();
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the contact controller.
     */
    function init() {
      contactView = new app.views.ContactView(self);
    }
  }
})();
