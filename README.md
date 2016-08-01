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

**Before going live:**

- Sort blog posts by date.
  - Provide oldest-first option.
- Cross-browser styling.
- Improve blog search bar (Handle: "foo bar" baz).

**After going live:**

- Refactor CSS.
- Add missing tests.

**Wishlist features:**

- Indicate page in nav.
- Sticky nav.
- Tag pool.
  - Toggle button: All / Any.
  - Multi-select input for tags.
- Move blog posts and portfolio pieces to a database.
