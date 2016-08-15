// AboutView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.AboutView = AboutView;

  /**
   * Creates a new About View.
   * @constructor
   * @param {AboutController} aboutController - The view's controller.
   */
  function AboutView(aboutController) {
    var self = this;
    var containerElem = document.getElementById('main');
    var aboutTemplate = document.getElementById('about-template').innerHTML;

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
      containerElem.innerHTML = aboutTemplate;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the about view.
     */
    function init() {}
  }
})();
