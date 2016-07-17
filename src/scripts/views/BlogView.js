// BlogView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.BlogView = BlogView;

  /**
   * Creates a new Blog View.
   * @constructor
   * @param {BlogController} blogController - The view's controller.
   */
  function BlogView(blogController) {
    var self = this;
    var containerElem = document.querySelector('.main');
    var blogTemplate = document.getElementById('blog-template').innerHTML;
    var postTemplate = document.getElementById('post-template').innerHTML;
    // Initialized on render.
    var postContainerElem;

    self.render = render;
    self.renderPosts = renderPosts;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Renders HTML to the document.
     * @param {object} [opts] - Rendering options.
     * @param {bool} [opts.hideSearch] - Hides the search form.
     */
    function render(opts) {
      // Get the post filters in order to properly initialize the search form.
      var postFilters = blogController.getPostFilters();
      // Format the blog template.
      var formattedBlogTemplate = blogTemplate
        .replace('{search-text}', postFilters.text)
        .replace('{search-week}', postFilters.maxAge === 'week' ?
          'selected' : '')
        .replace('{search-month}', postFilters.maxAge === 'month' ?
          'selected' : '')
        .replace('{search-year}', postFilters.maxAge === 'year' ?
          'selected' : '')
        .replace('{search-all}', postFilters.maxAge === 'all' ?
          'selected' : '');

      // Handle hideSearch option.
      var hideSearch = '';
      if (opts && opts.hideSearch) {
        hideSearch = 'hidden';
      }

      formattedBlogTemplate = formattedBlogTemplate
        .replace('{hide-search}', hideSearch);

      // Set the container element's inner HTML to the formatted blog template.
      containerElem.innerHTML = formattedBlogTemplate;
      // Get a reference to the blog post's container element.
      postContainerElem = document.querySelector('.blog-posts');

      // Add event listeners.
      var searchForm = document.querySelector('.blog-search');
      var searchBar = document.querySelector('.blog-search__search-bar');
      var timeOptions = document.querySelector('.blog-search__time-options');
      // Prevent form submission from reloading the page.
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
      });
      // Update post filters on search bar input.
      searchBar.addEventListener('input', function(e) {
        blogController.updatePostFilters({text: e.target.value});
        renderPosts();
      });
      // Update post filters on time options change.
      timeOptions.addEventListener('change', function(e) {
        blogController.updatePostFilters({maxAge: e.target.value});
        renderPosts();
      });

      // Render posts.
      renderPosts();
    }

    /**
     * Renders posts.
     */
    function renderPosts() {
      // Get posts to be rendered.
      var posts = blogController.getPosts();

      // Convert posts into formatted post templates, then join them into a
      // single HTML string.
      posts = posts.map(function(post) {
        return formatPostTemplate(post);
      }).join('');

      // Set the blog posts' container element's inner HTML to the formatted
      // blog post templates.
      postContainerElem.innerHTML = posts;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the blog view.
     */
    function init() {}

    /**
     * Formats a post template with data from a post.
     * @param {Post} post - The post used to format the template.
     * @return {string} - The formatted template.
     */
    function formatPostTemplate(post) {
      // Format post template.
      var formattedPostTemplate = postTemplate
        .replace('{post-id}', blogController.getPostID(post))
        .replace('{title}', post.title)
        .replace('{content}', post.content)
        .replace('{date}', post.date.toLocaleDateString())
        .replace('{iso-date}', post.date.toISOString())
        .replace('{subtitle}', post.subtitle ?
                               '<p class="post__subtitle">' +
                               post.subtitle +
                               '</p>' :
                               '')
        .replace('{tags}', post.tags ? post.tags.join(', ') : '');

      return formattedPostTemplate;
    }
  }
})();
