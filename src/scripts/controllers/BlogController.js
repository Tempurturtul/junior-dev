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
      post: null,
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
      // Get raw data.
      var posts = mainController.getStoredData('blogPosts');

      // Convert raw data to Post instances.
      posts = posts
        .map(function(post) {
          return new app.models.Post(post);
        });

      // Filter posts.
      posts = filterPosts(posts, postFilters);

      return posts;
    }

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      updatePostFilters(params);

      var opts = {};
      // Handle post param (indicating viewing of a single specific post).
      if (params.post) {
        opts.hideSearch = true;
      }

      blogView.render(opts);
    }

    /**
     * Updates post filters.
     * @param {object} data - New post filter data.
     */
    function updatePostFilters(data) {
      // Reset postFilters.post, since we do not want it to persist implicitly.
      postFilters.post = null;

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

    /**
     * Filters posts.
     * @param {Post[]} posts - Posts to filter.
     * @param {object} filters - Filters to apply.
     * @param {string} filters.post - A particular post ID.
     * @param {string} filters.text - Text to search posts for.
     * @param {string} filters.maxAge - Maximum age of a post.
     * @return {Post[]} - Filtered posts.
     */
    function filterPosts(posts, filters) {
      // Check for filtering by post ID.
      // (No need to filter by anything else if post ID is used.)
      if (filters.post) {
        posts = posts
          .filter(function(post) {
            return filters.post === getPostID(post);
          });
      } else {
        // Filter by text. (Must match all space-separated strings.)
        if (filters.text) {
          var strs = filters.text.split(' ');
          var strsLen = strs.length;

          posts = posts
            .filter(function(post) {
              // Get the post's content minus any HTML markup in order to
              // search it without interference.

              // First, encode any escaped angle braces to avoid removing them.
              var htmlFreeContent = post.content
                .replace(/\\</g, '&lt;')
                .replace(/\\>/g, '&gt;');
              // Next, strip all HTML markup.
              htmlFreeContent = htmlFreeContent
                .replace(/<[^>]+>/g, '');
              // Finally, decode angle braces to original form (minus escapes).
              htmlFreeContent = htmlFreeContent
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');

              // For each space separated string...
              for (var i = 0; i < strsLen; i++) {
                // If the string doesn't exist in the post's title, content,
                // tags (exact match), or subtitle...
                if (post.title.indexOf(strs[i]) === -1 &&
                    htmlFreeContent.indexOf(strs[i]) === -1 &&
                    post.tags.indexOf(strs[i]) === -1 &&
                    (!post.subtitle ||
                      post.subtitle.indexOf(strs[i]) === -1)) {
                  // Exclude the post.
                  return false;
                }
              }

              // Otherwise, each string does exist somewhere in the post,
              // therefore include the post.
              return true;
            });
        }

        // Filter by max age.
        if (filters.maxAge !== 'all') {
          var startDate = Date.past(filters.maxAge);
          posts = posts
            .filter(function(post) {
              return post.date >= startDate;
            });
        }
      }

      return posts;
    }
  }
})();
