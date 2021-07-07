# gatsby-remark-double-brackets-link

Transform `[[Link to page]]` into `[Link to page](titleToURL('Link to page'))`.

An example site for using this plugin is at [https://mathieudutour.github.io/gatsby-digital-garden/](https://mathieudutour.github.io/gatsby-digital-garden/)

## Installation

```bash
npm install gatsby-remark-double-brackets-link
```

## Usage

Add the plugin to your Gatsby config:

```js
{
  resolve: `gatsby-plugin-mdx`,
  options: {
    gatsbyRemarkPlugins: [
      {
        resolve: `gatsby-remark-double-brackets-link`,
      },
    ],
  },
}
```

### Resolving the URL

By default, the plugin will resolve the url with:

```js
(title: string) => {
  const segments = title.split('/')
  const slugifiedTitle = slugify(segments.pop() as string)
  return `${segments.join('/')}/${slugifiedTitle}`
};
```

You can override this behavior by passing a `titleToURLPath` option pointing to a JavaScript exporting a function receiving the title as argument and returning a string.

For example:

```js
// resolve-url.js
const slugify = require('slugify')
module.exports = (title) => `/${slugify(title)}`

// gatsby-config.js
{
  ...
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      gatsbyRemarkPlugins: [
        {
          resolve: `gatsby-remark-double-brackets-link`,
          options: {
            titleToURLPath: `${__dirname}/resolve-url.js`
          },
        }
      ],
    },
  }
  ...
}
```

By default, the plugin will keep the brackets in the link name. You can change this behavior by passing a `stripBrackets` options.

### WikiLinks

By default, the plugin will ignore Wiki style links (eg. `[[Internal link|With custom text]]`).

To parse them, pass `parseWikiLinks` as an option.
