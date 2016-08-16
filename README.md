# Home

***A work in progress.***

Home page built with vanilla HTML, CSS, and JavaScript.

Includes a personal blog and portfolio.

## Quickstart

- Install [Node](https://nodejs.org/en/).
- Clone this repository and navigate to it.

  ```
  git clone https://github.com/Tempurturtul/home.git
  cd home/
  ```

- Install dependencies.

  ```
  npm i
  ```

- Use npm scripts to generate files, lint, serve, and test.

  ```
  # Generate JSON files for blog posts and portfolio pieces.
  npm run generate

  # Lint, serve, and watch for changes.
  npm start

  # Run tests.
  npm t
  ```

## TODO

- Normalize template use.
  - Don't mix HTML declaration inconsistently between templates and views. Move all HTML currently in views to templates, then organize.
- Finish styling refactor.
  - Including rework of blog and portfolio.
- Add landing page and change default route.
- Add contact page (formspree).
- Gracefully degrade for those with JavaScript disabled.
  - SPA to multi-page.
  - Hide JS-dependent blog controls.
  - Test contact page functionality; warn user if non-functional.
  - Consider disabling tag:hover styling.
- Test in most popular browsers.
- Finish adding content.
