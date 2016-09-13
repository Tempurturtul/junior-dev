# Building a Home

**The how and why behind the Junior Dev site.**

*Created: September 12, 2016*

## Core Technologies

Junior Dev is built with HTML, CSS, and JavaScript. Or more specifically: HTML5, CSS3, and ES5.

When deciding how to build the site, I chose these three languages because I wanted to demonstrate and improve my understanding of the fundamentals of web development. I chose to avoid third-party code as much as possible in favor of writing my own, in order to best demonstrate my ability to potential employers. The only third-party code that directly influences the distribution files at the time of writing is [showdown](https://github.com/showdownjs/showdown), a markdown-to-html parser that I use for convenience when creating new blog posts.

I make heavy use of templates in the HTML, each one of which is contained in a `<script type="text/html">` tag in the main `index.html` file. Ideally these templates would exist in their own separate files, but without the use of a transpiler I believe this to be the next best thing.

The site's CSS is written using a combination of practices derived from the [Block-Element-Modifier (BEM)](https://en.bem.info/) methodology and the [SMACSS](https://smacss.com/) architecture pattern, resulting in what I believe to be (mostly) modular and (mostly) sane styles.

Regarding the JavaScript, I chose to avoid using ES6 features (though I love them) because they're not fully supported at time of writing and I want to avoid using a transpiler. [JSDoc](http://usejsdoc.org/) comments are included throughout all of the JavaScript.

## Design Pattern

The site is designed around the popular Model-View-Controller (MVC) design pattern, implemented from scratch in JavaScript. The [Vanilla JavaScript TodoMVC example](https://github.com/tastejs/todomvc/tree/master/examples/vanillajs) served as a best-practices guide, though I believe I ended up straying from the ideal path in places. (There exists repetition in my views and controllers indicating design flaws on my part. I hope to eliminate these flaws when time permits, but am currently unsure of the best way to proceed.)

In order to modularize my JavaScript, I use [Immediately-Invoked Function Expressions (IIFE)](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) in all of my client-side code. I also take care to isolate and organize my exposed code in the global namespace under the `window.app` object, which is defined by whichever of the asynchronously loaded files executes first.

In place of a database, the data for the site is at time of writing stored in two JSON files which are included as resources in the HTML and accessed via XMLHttpRequests. This keeps the data separate from the rest of the application and should make the eventual transition to a proper database a smooth process.

## Router

I built a [hash-based router](/scripts/Router.js) for Junior Dev that's capable of parsing query strings, accepting parameterized routes, and suspending operation; along with other commonly expected functionality. It utilizes the same design pattern as the rest of the site's JavaScript, meaning that the router is only exposed under the `window.app` object. I've written [thorough tests](https://github.com/Tempurturtul/junior-dev/blob/master/src/scripts/Router.test.js) for the router, and fully documented it with JSDoc style comments. It should be ready to port to other projects without issue.

## Development Tools

I use [Node.js](https://nodejs.org/en/) during development, and utilize [npm](https://www.npmjs.com/) as my build tool and task runner.

My `package.json` file includes scripts for the following:
  - error and style checking
    - using [eslint](https://github.com/eslint/eslint) and [stylelint](https://github.com/stylelint/stylelint)
  - local hosting and automatic refreshing of the project
    - using [browser-sync](https://github.com/BrowserSync/browser-sync)
  - testing, optionally in a browser environment
    - using [tape](https://github.com/substack/tape) and [jsdom](https://github.com/tmpvar/jsdom)
  - generation of JSON files from markdown and from other JSON files
    - using [custom code](https://github.com/Tempurturtul/junior-dev/tree/master/build) and [showdown](https://github.com/showdownjs/showdown)
  - automated deployment to GitHub Pages
    - using [gh-pages](https://github.com/tschaub/gh-pages)

*Tags: project*
