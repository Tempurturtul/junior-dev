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
      searchBar.addEventListener('input', handleSearchBarInput);
      // Update post filters on time options change.
      timeOptions.addEventListener('change', handleTimeOptionsChange);

      // Render posts.
      renderPosts();
    }

    /**
     * Renders posts.
     */
    function renderPosts() {
      // Get posts to be rendered.
      var posts = blogController.getPosts();
      // Get the post filters in order to properly initialize tags.
      var postFilters = blogController.getPostFilters();

      // Convert posts into formatted post templates, then join them into a
      // single HTML string.
      posts = posts.map(function(post) {
        return formatPostTemplate(post);
      }).join('');

      // Set the blog posts' container element's inner HTML to the formatted
      // blog post templates.
      postContainerElem.innerHTML = posts;

      // Add event listeners.
      var tags = document.getElementsByClassName('post__tag');
      var len = tags.length;
      // For each tag...
      for (var i = 0; i < len; i++) {
        // Add the handleTagClick event listener.
        tags[i].addEventListener('click', handleTagClick);
        // Add the --active modifier if the tag is present in the filters.
        if (postFilters.tags.indexOf(tags[i].textContent) !== -1) {
          tags[i].classList.add('post__tag--active');
        }
      }
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
        .replace('{subtitle}', post.subtitle ? post.subtitle : '')
        .replace('{tags}', post.tags ?
          post.tags.map(function(tag) {
            return '<span class="post__tag">' + tag + '</span>';
          }).join(', ') :
          '');

      return formattedPostTemplate;
    }

    /**
     * Handles search bar input event by updating blog controller's post
     * filters using the new search bar value, then refreshing the blog posts.
     * @param {Event} e - The input event.
     */
    function handleSearchBarInput(e) {
      blogController.updatePostFilters({text: e.target.value});
      renderPosts();
    }

    /**
     * Handles tag click event by updating the blog controller's post filters
     * with the clicked tag.
     * @param {Event} e - The click event.
     */
    function handleTagClick(e) {
      var clickedTag = e.target.textContent;
      // Get existing post filter tags.
      var tags = blogController.getPostFilters().tags;
      // Add or remove the clicked tag from the existing tags.
      if (tags.indexOf(clickedTag) === -1) {
        tags.push(clickedTag);
      } else {
        tags.splice(tags.indexOf(clickedTag), 1);
      }
      // Update the post filters.
      blogController.updatePostFilters({tags: tags});
      // Re-render the posts.
      renderPosts();
    }

    /**
     * Handles time options change event by updating blog controller's post
     * filters using the newly selected time options value, then refreshing
     * the blog posts.
     * @param {Event} e - The input event.
     */
    function handleTimeOptionsChange(e) {
      blogController.updatePostFilters({maxAge: e.target.value});
      renderPosts();
    }
  }
})();
