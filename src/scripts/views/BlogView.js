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
    var tagFilterTemplate = document.getElementById('tag-filter-template')
      .innerHTML;
    // Initialized on render.
    var postContainerElem;
    var tagFiltersContainerElem;
    var navGroupContainerElem;

    self.render = render;
    self.renderTagFilters = renderTagFilters;
    self.renderNavGroups = renderNavGroups;
    self.renderPost = renderPost;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Renders HTML to the document.
     * @param {object} [opts] - Rendering options.
     * @param {string} [opts.post] - A specific post to display.
     */
    function render(opts) {
      // Ensure opts isn't undefined.
      opts = opts || {};

      // Format the blog template.
      var formattedBlogTemplate = blogTemplate
        .replace('{hide-top}', opts.post ? 'hidden' : '')
        .replace('{search-text}', blogController.getPostFilters().text);

      // Set the container element's inner HTML to the formatted blog template.
      containerElem.innerHTML = formattedBlogTemplate;

      // Get references to the sub-container elements.
      tagFiltersContainerElem = document.querySelector('.tag-filters__filters');
      navGroupContainerElem = document.querySelector('.blog-nav__group-list');
      postContainerElem = document.querySelector('.blog-post-container');

      // Add search bar event listener.
      var searchBar = document.querySelector('.blog-nav__search');
      searchBar.addEventListener('input', handleSearchBarInput);

      // Add collapsible listeners.
      addCollapsibleListeners(containerElem);

      // Render dynamic content.
      renderTagFilters();
      renderNavGroups();
      renderPost();
    }

    /**
     * Adds event listeners to collapsible components that are children of the
     * specified parent element.
     * @param {Element} parent - The parent element.
     */
    function addCollapsibleListeners(parent) {
      var drawers = parent.getElementsByClassName('collapsible-drawer');
      var lists = parent.getElementsByClassName('collapsible-list');

      var i;
      var len;
      var btn;

      // For each collapsible drawer...
      for (i = 0, len = drawers.length; i < len; i++) {
        btn = drawers[i].querySelector('.collapsible-drawer__toggle');
        btn.addEventListener('click', handleCollapsibleToggle);
      }

      // For each collapsible list...
      for (i = 0, len = lists.length; i < len; i++) {
        btn = lists[i].querySelector('.collapsible-list__toggle');
        btn.addEventListener('click', handleCollapsibleToggle);
      }
    }

    /**
     * Renders tag filters.
     */
    function renderTagFilters() {
      // Get all tags.
      var tags = blogController.getAllTags();
      // Get filtered tags.
      var filtered = blogController.getPostFilters().tags;

      // Convert tags to a single string of formatted tag filter templates.
      tags = tags.map(function(tag) {
        return tagFilterTemplate
          .replace('{tag-value}', tag)
          .replace('{tag}', tag)
          .replace('{checked}', filtered.indexOf(tag) === -1 ?
                                '' :
                                'checked');
      })
      .join('');

      tagFiltersContainerElem.innerHTML = tags;

      // Add event listeners.
      var checkboxes = document.getElementsByClassName('tag-filters__checkbox');
      var len = checkboxes.length;
      // For each checkbox...
      for (var i = 0; i < len; i++) {
        // Add the handleTagFilterChange event listener.
        checkboxes[i].addEventListener('change', handleTagFilterChange);
      }
      var filtersResetBtn = document
        .querySelector('.tag-filters__reset-btn');
      filtersResetBtn.addEventListener('click', handleFiltersResetClick);
    }

    /**
     * Renders nav groups.
     */
    function renderNavGroups() {
      navGroupContainerElem.innerHTML = formatNavGroups();

      addCollapsibleListeners(navGroupContainerElem);
    }

    /**
     * Renders a blog post.
     */
    function renderPost() {
      // Get post to be rendered.
      var post = blogController.getPost();

      // If there's a post to be rendered...
      if (post) {
        // Get the post filters in order to properly initialize tags.
        var postFilters = blogController.getPostFilters();

        // Convert post into a formatted post template.
        post = formatPostTemplate(post);

        // Set the blog post's container element's inner HTML to the formatted
        // blog post template.
        postContainerElem.innerHTML = post;

        // Add event listeners.
        var tags = document.getElementsByClassName('blog-post__tag');
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
      } else {
        // Clear the post container element's inner HTML.
        postContainerElem.innerHTML = '';
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

      // Get filtered posts sorted newest to oldest.
      var posts = blogController.getPosts({sortOldest: false}) || [];

      // Group posts by month.
      posts = posts
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
      return posts
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
      // Get filters to determine active tags.
      var postFilters = blogController.getPostFilters();

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
          formatTagTemplates(post, postFilters.tags) :
          '');

      return formattedPostTemplate;
    }

    /**
     * Formats a post tag template for each tag on the given post.
     * @param {Post} post - A post.
     * @param {string[]} activeTags - Array of active tags.
     * @return {string} - Formatted post tag templates as a single HTML string.
     */
    function formatTagTemplates(post, activeTags) {
      // Get the tags count in order to add a comma ',' to all but the last tag.
      var count = post.tags.length;

      return post.tags
        .map(function(tag, index) {
          return postTagTemplate
            .replace('{tag}', tag)
            .replace('{active}', activeTags.indexOf(tag) === -1 ?
              '' :
              'tag--active')
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
     * Handles tag filter change event by updating the controller's filtered
     * tags.
     * @param {Event} e - The change event.
     */
    function handleTagFilterChange(e) {
      var tag = e.target.value;
      var checked = e.target.checked;
      // Get filtered tags.
      var filteredTags = blogController.getPostFilters().tags;
      // Add or remove the clicked tag from the filtered tags.
      if (checked && filteredTags.indexOf(tag) === -1) {
        filteredTags.push(tag);
      } else if (!checked && filteredTags.indexOf(tag) !== -1) {
        filteredTags.splice(filteredTags.indexOf(tag), 1);
      }
      // Update the filtered tags.
      blogController.updatePostFilters({tags: filteredTags});
    }

    /**
     * Handles the filters reset click event by clearing all filtered tags.
     * @param {Event} e - The click event.
     */
    function handleFiltersResetClick(e) {
      var filteredTags = blogController.getPostFilters().tags;

      // Only do something if there are filtered tags.
      if (filteredTags.length) {
        // Set the filtered tags to an empty array.
        blogController.updatePostFilters({tags: []});
      }
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
