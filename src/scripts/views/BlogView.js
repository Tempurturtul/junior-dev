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
    var containerElem = document.getElementById('main');
    var blogTemplate = document.getElementById('blog-template').innerHTML;
    var postTemplate = document.getElementById('blog-post-template').innerHTML;
    var navGroupTemplate = document.getElementById('blog-nav-group-template')
      .innerHTML;
    var navPostTemplate = document.getElementById('blog-nav-post-template')
      .innerHTML;
    var postTagTemplate = document.getElementById('blog-post-tag-template')
      .innerHTML;
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
      // Format nav groups for the blog nav.
      var formattedNavGroups = formatNavGroups();

      // Format the blog template.
      var formattedBlogTemplate = blogTemplate
        .replace('{hide-search}', opts && opts.hideSearch ? 'hidden' : '')
        .replace('{search-text}', postFilters.text)
        .replace('{search-week}', postFilters.maxAge === 'week' ?
          'selected' : '')
        .replace('{search-month}', postFilters.maxAge === 'month' ?
          'selected' : '')
        .replace('{search-year}', postFilters.maxAge === 'year' ?
          'selected' : '')
        .replace('{search-all}', postFilters.maxAge === 'all' ?
          'selected' : '')
        .replace('{sort-oldest}', postFilters.sortOldest ?
          'checked' : '')
        .replace('{nav-groups}', formattedNavGroups);

      // Set the container element's inner HTML to the formatted blog template.
      containerElem.innerHTML = formattedBlogTemplate;
      // Get a reference to the blog post's container element.
      postContainerElem = document.querySelector('.blog-posts');

      // Add event listeners.
      var searchForm = document.querySelector('.blog-search');
      var searchBar = document.querySelector('.blog-search__search-bar');
      var timeOptions = document.querySelector('.blog-search__time-options');
      var sortOldest = document.querySelector('.blog-search__sort-oldest');
      var collapsibleDrawers = document
        .getElementsByClassName('collapsible-drawer');
      var collapsibleLists = document
        .getElementsByClassName('collapsible-list');

      // Prevent form submission from reloading the page.
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
      });
      // Update post filters on search bar input.
      searchBar.addEventListener('input', handleSearchBarInput);
      // Update post filters on time options change.
      timeOptions.addEventListener('change', handleTimeOptionsChange);
      // Update post filters on sort oldest change.
      sortOldest.addEventListener('change', handleSortOldestChange);
      // Toggle collapsed state on collapsibles.
      var i;
      var len = collapsibleDrawers.length;
      var btn;
      for (i = 0; i < len; i++) {
        btn = collapsibleDrawers[i]
          .querySelector('.collapsible-drawer__toggle');
        btn.addEventListener('click', handleCollapsibleToggle);
      }
      len = collapsibleLists.length;
      for (i = 0; i < len; i++) {
        btn = collapsibleLists[i]
          .querySelector('.collapsible-list__toggle');
        btn.addEventListener('click', handleCollapsibleToggle);
      }

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
          tags[i].classList.add('tag--active');
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
     * Formats a nav group template for each month containing at least one post.
     * @return {string} - The formatted nav group templates.
     */
    function formatNavGroups() {
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      // Get all posts sorted newest to oldest.
      var allPosts = blogController.getPosts({getAll: true, sortOldest: false});

      // Group posts by month.
      allPosts = allPosts
        .reduce(function(acc, curr) {
          // The latest accumulated group.
          var group = acc.length ? acc[acc.length - 1] : null;
          // The latest accumulated group's month and year.
          var groupMonthYear = [];
          // The current post's month and year.
          var currMonthYear = [
            curr.created ? curr.created.getMonth() : null,
            curr.created ? curr.created.getFullYear() : null
          ];

          // If there is an accumulated group, set its month and year.
          if (group) {
            groupMonthYear = [
              group[0].created ? group[0].created.getMonth() : null,
              group[0].created ? group[0].created.getFullYear() : null
            ];
          }

          // Check if the current post belongs in the latest group, or a new
          // one.
          if (groupMonthYear[0] === currMonthYear[0] &&
              groupMonthYear[1] === currMonthYear[1]) {
            group.push(curr);
          } else {
            acc.push([curr]);
          }

          return acc;
        }, []);

      // Convert all groups into formatted nav group templates, then join and
      // return them.
      return allPosts
        .map(function(group) {
          return navGroupTemplate
            .replace('{date}', group.length && group[0].created ?
                               months[group[0].created.getMonth()] + ' ' +
                               group[0].created.getFullYear() :
                               'undated')
            .replace('{nav-posts}', formatNavPosts(group));
        })
        .join('');
    }

    /**
     * Formats a nav post template each post in a group.
     * @param {Post[]} group - A group of posts.
     * @return {string} - The formatted nav posts strings.
     */
    function formatNavPosts(group) {
      return group
        .map(function(post) {
          return navPostTemplate
            .replace('{post-id}', blogController.getPostID(post))
            .replace('{post-title}', post.title || 'untitled');
        })
        .join('');
    }

    /**
     * Formats a post template with data from a post.
     * @param {Post} post - The post used to format the template.
     * @return {string} - The formatted template.
     */
    function formatPostTemplate(post) {
      // Format post template.
      var formattedPostTemplate = postTemplate
        .replace('{post-id}', blogController.getPostID(post))
        .replace('{title}', post.title || '')
        .replace('{content}', post.content || '')
        .replace('{created}', post.created ?
          post.created.toLocaleDateString() :
          '')
        .replace('{created-iso}', post.created ?
          post.created.toISOString() :
          '')
        .replace('{hide-modified}', post.modified ? '' : 'hidden')
        .replace('{modified}', post.modified ?
          post.modified.toLocaleDateString() :
          '')
        .replace('{modified-iso}', post.modified ?
          post.modified.toISOString() :
          '')
        .replace('{subtitle}', post.subtitle || '')
        .replace('{tags}', post.tags ?
          formatPostTags(post) :
          '');

      return formattedPostTemplate;
    }

    /**
     * Formats a post tag template for each tag on the given post.
     * @param {Post} post - A post.
     * @return {string} - Formatted post tag templates as a single HTML string.
     */
    function formatPostTags(post) {
      // Get the tags count in order to add a comma ',' to all but the last tag.
      var count = post.tags.length;

      return post.tags
        .map(function(tag, index) {
          return postTagTemplate
            .replace('{tag}', tag)
            .replace('{comma}', index + 1 === count ?
              '' :
              ',');
        })
        .join('');
    }

    /**
     * Handles search bar input event by updating blog controller's post
     * filters using the new search bar value.
     * @param {Event} e - The input event.
     */
    function handleSearchBarInput(e) {
      blogController.updatePostFilters({text: e.target.value});
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
    }

    /**
     * Handles time options change event by updating blog controller's post
     * filters using the newly selected time options value.
     * @param {Event} e - The input event.
     */
    function handleTimeOptionsChange(e) {
      blogController.updatePostFilters({maxAge: e.target.value});
    }

    /**
     * Handles sort oldest change event by updating blog controller's post
     * filters using the sort oldest input's checked value.
     * @param {Event} e - The input event.
     */
    function handleSortOldestChange(e) {
      blogController.updatePostFilters({sortOldest: e.target.checked});
    }

    /**
     * Handles collapsible toggle click event by toggling the --collapsed
     * modifier on the toggle button's parent collapsible element.
     * @param {Event} e - The click event.
     */
    function handleCollapsibleToggle(e) {
      var elem = e.target.parentElement;

      if (elem.classList.contains('collapsible-drawer')) {
        elem.classList.toggle('collapsible-drawer--collapsed');
      } else if (elem.classList.contains('collapsible-list')) {
        elem.classList.toggle('collapsible-list--collapsed');
      }
    }
  }
})();
