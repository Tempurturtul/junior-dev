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

    self.getPosts = getPosts;
    self.setView = setView;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Gets blog posts.
     * @param {object} [filterOpts] - Filter options.
     * @param {string[]} [filterOpts.tags] - Tags to filter by.
     * @param {object} [filterOpts.dates] - Dates to filter by.
     * @param {Date} [filterOpts.dates.start] - Start date to filter by.
     * @param {Date} [filterOpts.dates.end] - End date to filter by.
     * @return {Post[]} - An array of blog posts.
     */
    function getPosts(filterOpts) {
      var posts = mainController.getStoredData('blogPosts');

      // Convert raw data to Post instances.
      posts = posts
        .map(function(post) {
          return new app.models.Post(post);
        });

      // Filter posts.
      if (filterOpts) {
        // Filter by tags.
        if (filterOpts.tags) {
          posts = posts
            .filter(function(post) {
              // For each tag in filter options...
              filterOpts.tags.forEach(function(tag) {
                // If the post doesn't contain the tag, filter it out.
                if (post.tags.indexOf(tag) === -1) {
                  return false;
                }
              });

              // The post contains all the tags, include it.
              return true;
            });
        }

        // Filter by date range (inclusive).
        if (filterOpts.dates) {
          // Filter by start date.
          if (filterOpts.dates.start) {
            posts = posts
              .filter(function(post) {
                return post.date >= filterOpts.dates.start;
              });
          }

          // Filter by end date.
          if (filterOpts.dates.end) {
            posts = posts
              .filter(function(post) {
                return post.date <= filterOpts.dates.start;
              });
          }
        }
      }

      return posts;
    }

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      var filterOpts = {
        tags: params.tags || null,
        dates: {
          start: params.daterange ? params.daterange[0] : null,
          end: params.daterange ? params.daterange[1] : null,
        }
      };
      var data = {
        posts: getPosts(filterOpts)
      };

      blogView.refresh(data);
      blogView.render();
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
