// BlogController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.BlogController = BlogController;

  /**
   * Creates a new Blog Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function BlogController(mainController) {
    var self = this;
    // Assigned during initialization.
    var blogView;
    var postFilters = {
      text: '',
      maxAge: 'all'
    };

    self.getPostFilters = getPostFilters;
    self.getPostID = getPostID;
    self.getPosts = getPosts;
    self.setView = setView;
    self.updatePostFilters = updatePostFilters;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Gets the current post filters.
     * @return {object} - The post filters.
     */
    function getPostFilters() {
      return postFilters;
    }

    /**
     * Gets the ID (based on title) for a blog post.
     * @param {Post} post - A blog post.
     * @return {string} - The blog post's ID.
     */
    function getPostID(post) {
      return post.title.replace(/\s/g, '-').toLowerCase();
    }

    /**
     * Gets blog posts.
     * @return {Post[]} - An array of blog posts.
     */
    function getPosts() {
      var posts = mainController.getStoredData('blogPosts');

      // Convert raw data to Post instances.
      posts = posts
        .map(function(post) {
          return new app.models.Post(post);
        });

      // Filter by text.
      if (postFilters.text) {
        posts = posts
          .filter(function(post) {
            var re = new RegExp(postFilters.text, 'i');

            if (re.test(post.title)) {
              return true;
            }
            if (re.test(post.subtitle)) {
              return true;
            }
            if (re.test(post.tags)) {
              return true;
            }
            if (re.test(post.content)) {
              return true;
            }

            return false;
          });
      }

      // Filter by max age.
      if (postFilters.maxAge !== 'all') {
        var startDate = Date.past(postFilters.maxAge);
        posts = posts
          .filter(function(post) {
            return post.date >= startDate;
          });
      }

      return posts;
    }

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      updatePostFilters(params);
      blogView.render();
    }

    /**
     * Updates post filters.
     * @param {object} data - New post filter data.
     */
    function updatePostFilters(data) {
      for (var prop in data) {
        if (postFilters.hasOwnProperty(prop)) {
          postFilters[prop] = data[prop];
        }
      }
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the blog controller.
     */
    function init() {
      blogView = new app.views.BlogView(self);
    }
  }
})();
