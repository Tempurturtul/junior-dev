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
      maxAge: 'all',
      sortOldest: false,
      tags: []
    };

    self.getPostFilters = getPostFilters;
    self.getPostID = getPostID;
    self.getPosts = getPosts;
    self.getPost = getPost;
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
     * NOTE The ID will not be unique if two posts share the same title.
     * @param {Post} post - A blog post.
     * @return {string} - The blog post's ID.
     */
    function getPostID(post) {
      return post.title ? post.title.replace(/\s/g, '-').toLowerCase() : '';
    }

    /**
     * Gets blog posts.
     * @param {object} [opts] - Options.
     * @param {bool} [opts.getAll] - Get all blog posts. (Overrides filters.)
     * @param {bool} [opts.oldestFirst] - Sort by oldest first (or by
     * youngest first, if false). (Overrides filters.)
     * @return {Post[]} - An array of blog posts.
     */
    function getPosts(opts) {
      opts = opts || {};

      // Get raw data.
      var posts = mainController.getStoredData('blogPosts');

      // Convert raw data to Post instances.
      posts = posts
        .map(function(post) {
          return new app.models.Post(post);
        });

      // Filter posts if not ignoring filters.
      posts = opts.getAll ? posts : filterPosts(posts, postFilters);

      // Sort posts.
      if (opts.hasOwnProperty('oldestFirst')) {
        posts = sortPosts(posts, opts.oldestFirst);
      } else {
        posts = sortPosts(posts, postFilters.sortOldest);
      }

      return posts;
    }

    /**
     * Gets the active blog post. (That is: the first post in the sorted,
     * filtered list.)
     * @return {Post} - The current blog post.
     */
    function getPost() {
      var posts = getPosts();
      return posts.length ? posts[0] : null;
    }

    /**
     * Sets the view.
     * @param {object} params - Parameters from a query string and/or
     * parameterized route.
     */
    function setView(params) {
      // Ensure params has a post property to avoid implicitly persisting a
      // specific post filter when navigating from "#/blog/:post" to "#/blog".
      params.post = params.post || null;

      updatePostFilters(params, false);

      blogView.render();
    }

    /**
     * Updates post filters and optionally re-renders posts (default).
     * @param {object} data - New post filter data.
     * @param {bool} [render=true] - Re-render posts.
     */
    function updatePostFilters(data, render) {
      // Handle default value for render.
      if (render === undefined) {
        render = true;
      }

      for (var prop in data) {
        if (postFilters.hasOwnProperty(prop)) {
          postFilters[prop] = data[prop];
        }
      }

      if (render) {
        blogView.renderPost();
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
     * @param {string[]} filters.tags - Post tags that must be present.
     * @return {Post[]} - Filtered posts.
     */
    function filterPosts(posts, filters) {
      var i;

      // Check for filtering by post ID.
      // (No need to filter by anything else if post ID is used.)
      if (filters.post) {
        posts = posts
          .filter(function(post) {
            return filters.post === getPostID(post);
          });
      } else {
        // Filter by text.
        // (Must match all double-quoted and space-separated strings.)
        if (filters.text) {
          // Convert search text to lower case.
          var search = filters.text.toLowerCase();

          // Get array of double-quoted strings.
          var dblQuoted = search.match(/"[^"]*"/g) || [];

          // Remove double quoted strings from search text.
          dblQuoted.forEach(function(str) {
            search = search.replace(str, '');
          });

          // Get space-separated strings from search text and filter out
          // empty strings and left-over double-quotes.
          search = search.split(' ')
            .filter(function(str) {
              return str;
            })
             .map(function(str) {
               return str.replace('"', '');
             });

          // Remove double quotes from double quoted strings.
          dblQuoted = dblQuoted.map(function(str) {
            return str.substring(1, str.length - 1);
          });

          // Add double quoted strings back into search text.
          search = search.concat(dblQuoted);

          // Get the length of the search text array.
          var searchLen = search.length;

          posts = posts
            .filter(function(post) {
              // Get the post's title and subtitle, and convert them to
              // lower case.
              var title = post.title ? post.title.toLowerCase() : '';
              var subtitle = post.subtitle ? post.subtitle.toLowerCase() : '';
              // Get the post's content minus any HTML markup in order to
              // search it without interference, then convert it to lower case.
              // First, encode any escaped angle braces to avoid removing them.
              var content = post.content ?
                            post.content
                              .replace(/\\</g, '&lt;')
                              .replace(/\\>/g, '&gt;') :
                            '';
              // Next, strip all HTML markup.
              content = content
                .replace(/<[^>]+>/g, '');
              // Finally, decode angle braces to original form (minus escapes).
              content = content
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
              // Then just remember to convert to lower case.
              content = content.toLowerCase();

              // For searched string...
              for (i = 0; i < searchLen; i++) {
                // If the string doesn't exist in the post's title, subtitle,
                // tags (exactly matching), or content...
                if (title.indexOf(search[i]) === -1 &&
                    subtitle.indexOf(search[i]) === -1 &&
                    (!post.tags || post.tags.indexOf(search[i]) === -1) &&
                    content.indexOf(search[i]) === -1) {
                  // Exclude the post.
                  return false;
                }
              }

              // Otherwise, each searched string does exist somewhere in the
              // post, therefore include the post.
              return true;
            });
        }

        // Filter by max age.
        if (filters.maxAge !== 'all') {
          var startDate = app.utils.past(filters.maxAge);
          posts = posts
            .filter(function(post) {
              return post.created ? post.created >= startDate : false;
            });
        }

        // Filter by tags.
        if (filters.tags.length) {
          var tagsLen = filters.tags.length;
          posts = posts
            .filter(function(post) {
              // For each filter tag...
              for (i = 0; i < tagsLen; i++) {
                // If the tag doesn't exist in the post, exclude the post.
                if (!post.tags || post.tags.indexOf(filters.tags[i]) === -1) {
                  return false;
                }
              }

              return true;
            });
        }
      }

      return posts;
    }

    /**
     * Sorts blog posts by age.
     * @param {Post[]} posts - Posts to sort.
     * @param {bool} sortOldest - Sort oldest first. If false, sort newest
     * first.
     * @return {Post[]} - Sorted posts.
     */
    function sortPosts(posts, sortOldest) {
      posts.sort(function(a, b) {
        // filters.sortOldest determines age ascending or descending.
        if (sortOldest) {
          // Age Descending
          if (a.created < b.created) {
            return -1;
          }
          if (a.created > b.created) {
            return 1;
          }
        } else {
          // Age Ascending
          if (a.created > b.created) {
            return -1;
          }
          if (a.created < b.created) {
            return 1;
          }
        }

        // Always handle undefined created date by placing at beginning.
        // (Easier to notice and correct.)
        if (!a.created) {
          return -1;
        }
        if (!b.created) {
          return 1;
        }

        return 0;
      });

      return posts;
    }
  }
})();
