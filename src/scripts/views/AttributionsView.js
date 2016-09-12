// AttributionsView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.AttributionsView = AttributionsView;

  /**
   * Creates a new Attributions View.
   * @constructor
   * @param {AttributionsController} attributionsController - The view's controller.
   */
  function AttributionsView(attributionsController) {
    var self = this;
    var containerElem = document.getElementById('main');
    var attributionsTemplate = document.getElementById('attributions-template')
      .innerHTML;

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
      containerElem.innerHTML = attributionsTemplate;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the attributions view.
     */
    function init() {}
  }
})();
