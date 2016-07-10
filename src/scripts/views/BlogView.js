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
    var htmlTemplate;

    self.refresh = refresh;
    self.render = render;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Refreshes the view (but does not render).
     * @param {object} data - Data used to refresh the view.
     * @param {Post[]} data.posts - Posts to display in the view.
     */
    function refresh(data) {
      var posts = data.posts
        .map(function(post) {
          return formatPostTemplate(post);
        })
        .join('');

      htmlTemplate = document.getElementById('blog-template').innerHTML;
      htmlTemplate = htmlTemplate.replace('{posts}', posts);
    }

    /**
     * Renders HTML to the document.
     */
    function render() {
      // Get the element in which to render content.
      var el = document.querySelector('.main');
      // Set the element's content.
      el.innerHTML = htmlTemplate;

      // Add event listeners.
      var searchForm = document.getElementsByClassName('blog-search')[0];
      var searchBar = document.getElementsByClassName('blog-search__search-bar')[0];
      var timeOptions = document.getElementsByClassName('blog-search__time-options')[0];

      // Prevent form submission from reloading the page.
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
      });

      // Update query string on search bar input.
      searchBar.addEventListener('input', function(e) {
        // TODO: Sanitize input?
        blogController.search({
          text: e.target.value
        });
      });

      // Update query string on time options change.
      timeOptions.addEventListener('change', function(e) {
        blogController.search({
          maxAge: e.target.value
        });
      });
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the blog view.
     */
    function init() {
      var data = {
        posts: blogController.getPosts()
      };
      refresh(data);
    }

    /**
     * Formats a post template with data from a post.
     * @param {Post} post - The post used to format the template.
     * @return {string} - The formatted template.
     */
    function formatPostTemplate(post) {
      var template = document.getElementById('post-template').innerHTML;

      // Formate piece template.
      template = template
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

      return template;
    }
  }
})();
