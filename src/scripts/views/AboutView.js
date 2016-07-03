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
    var htmlTemplate = document.getElementById('about-template').innerHTML;

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
     * Initializes the about view.
     */
    function init() {}
  }
})();
