// store.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app._store = {
    blogPosts: [
      {
        title: 'Min',
        date: new Date(),
        content: '<p>I\'m a little teapot.</p>'
      },
      {
        title: 'Max',
        subtitle: '-imum',
        date: new Date('2011-09-25'),
        content: '<p><em>Ooooh...</em> so pretty.</p>',
        tags: ['js', 'css', 'html']
      },
      {
        title: 'Max Dos',
        subtitle: 'Again!',
        date: new Date('2011-09-30'),
        content: '<p><em>Ooooh...</em> so pretty. <em>Dos!</em></p>',
        tags: ['js', 'css', 'html', 'dos']
      }
    ],
    portfolioPieces: [
      {
        title: 'Home',
        description: 'Personal homepage featuring my blog and portfolio. Built with semantic HTML, modular CSS, and vanilla JavaScript (no third-party code used). Includes JSDoc comments throughout, BEM methodology for CSS, a thoroughly tested hash router, an MVC design pattern, build scripts via npm, testing (incomplete) with tape and jsdom, and modularization of code using IIFEs.',
        sourceURL: 'https://github.com/Tempurturtul/home'
      },
      {
        title: 'Neighborhood Map',
        description: 'A single-page web application built using Knockout that displays a Google Map of an area, along with various user-defined map markers. Users can filter and organize map markers in a list with user-created (and optionally nested) folders. Clicking on a map marker displays additional information about the location retrieved from the Google, Flickr, Foursquare, and Wikipedia APIs.',
        sourceURL: 'https://github.com/Tempurturtul/udacity-fend-projects/tree/master/fend-neighborhood-map',
        liveURL: 'https://tempurturtul.github.io/udacity-fend-projects/projects/fend-neighborhood-map/',
        image: {
          static: 'https://tempurturtul.github.io/udacity-fend-projects/projects/fend-portfolio/content/img/neighborhood-map-600x600.dd92c598.png',
          description: 'Preview of the project during use.'
        }
      }
    ]
  };
})();
