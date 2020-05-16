# gatsby-remark-double-brackets-link

Transform `[[Link to page]]` into `[Link to page](titleToURL('Link to page'))`.

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

By default, the plugin will resolve the url with:

```js
(title: string) => `/${slugify(title)}`;
```

You can override this behavior by passing a `titleToURL` option.

By default, the plugin will keep the brackets in the link name. You can change this behavior by passing a `stripBrackets` options.
