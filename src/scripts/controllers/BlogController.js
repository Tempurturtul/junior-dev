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
    var searchData = {
      text: '',
      tags: '',
      dates: []
    };

    self.getPostID = getPostID;
    self.getPosts = getPosts;
    self.setView = setView;
    self.search = search;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

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
     * @param {object} [filterOpts] - Filter options.
     * @param {string} [filterOpts.post] - A specific post to filter by.
     * @param {string} [filterOpts.text] - Generic string to filter by. Could
     * strictly match tags or loosely match titles.
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
        // Filter by specific post.
        if (filterOpts.post) {
          posts = posts
            .filter(function(post) {
              return getPostID(post) === filterOpts.post;
            });
        }

        // Filter by text.
        if (filterOpts.text) {
          posts = posts
            .filter(function(post) {
              var re = new RegExp(filterOpts.text, 'i');

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
        post: params.post || null,
        text: params.text || null,
        tags: params.tags || null,
        dates: {
          start: params.dates ? params.dates[0] : null,
          end: params.dates ? params.dates[1] : null
        }
      };
      var data = {
        posts: getPosts(filterOpts)
      };

      blogView.refresh(data);
      blogView.render();
    }

    /**
     * Searches for posts matching given search query data.
     * @param {object} data - The search query data.
     * @param {string} data.text - Text that may appear anywhere in post.
     * @param {string} data.maxAge - Max age of posts.
     */
    function search(data) {
      if (data.text) {
        searchData.text = data.text;
      }
      if (data.maxAge) {
        // TODO
      }

      mainController.setQueryString(searchData);
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
