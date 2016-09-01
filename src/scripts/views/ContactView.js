// ContactView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.ContactView = ContactView;

  /**
   * Creates a new Contact View.
   * @constructor
   * @param {ContactController} contactController - The view's controller.
   */
  function ContactView(contactController) {
    var self = this;
    var containerElem = document.getElementById('main');
    var contactTemplate = document.getElementById('contact-template').innerHTML;

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
      containerElem.innerHTML = contactTemplate;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the contact view.
     */
    function init() {}
  }
})();
