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

- Use npm scripts to test, lint, and serve.

  ```
  # Lint, serve, and watch for changes.
  npm start

  # Run tests.
  npm t

  # Run tests and watch for changes.
  npm run test:watch
  ```

## TODO

**Before going live:**

- Add content.
  - Automate creation of portfolio pieces collection from individual JSON files.
    1. Add the content of each portfolio piece JSON file to new `store/portfolio-pieces.json` file.
  - Automate creation of blog posts from markdown files.
    1. Automatically extract title, subtitle, content, and tags from each markdown file.
    1. Convert content to HTML.
    1. Create JSON object from extracted/processed data.
    1. Add each JSON object to new `store/posts.json` file.
  - Modify `store.js` to pull data from new JSON files.
- Cross-browser styling.

**After going live:**

- Add missing tests.
- Refactor CSS.

**Wishlist features:**

- Indicate page in nav.
- Sticky nav.
- Tag pool.
  - Toggle button: All / Any.
  - Multi-select input for tags.
