# gatsby-remark-double-parenthesis-link

Transform `((block Id))` into `[Link to block](idToURL('block Id'))`.

An example site for using this plugin is at [https://mathieudutour.github.io/gatsby-digital-garden/](https://mathieudutour.github.io/gatsby-digital-garden/)

## Installation

```bash
npm install gatsby-remark-double-parenthesis-link
```

## Usage

Add the plugin to your Gatsby config:

```js
{
  resolve: `gatsby-plugin-mdx`,
  options: {
    gatsbyRemarkPlugins: [
      {
        resolve: `gatsby-remark-double-parenthesis-link`,
      },
    ],
  },
}
```

By default, the plugin will resolve the url with:

```js
(id: string) => `/${slugify(id)}`;
```

You can override this behavior by passing a `idToURL` option.
