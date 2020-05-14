# gatsby-source-roamresearch

Source plugin for pulling data into Gatsby from
Roam Research. It creates links between pages so they can be
queried in Gatsby using GraphQL.

An example site for using this plugin is at
https://mathieudutour.github.io/gatsby-source-roamresearch

## Install

```shell
npm install --save gatsby-source-roamresearch
```

## How to use

First, you need a way to pass environment variables to the build process, so secrets and other secured data aren't committed to source control. We recommend using [`dotenv`][dotenv] which will then expose environment variables. [Read more about dotenv and using environment variables here][envvars]. Then we can _use_ these environment variables and configure our plugin.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        url: `https://roamresearch.com/#/app/YOUR_DATABASE_HERE`,
        // Learn about environment variables: https://gatsby.dev/env-vars
        email: process.env.ROAM_RESEARCH_EMAIL,
        password: process.env.ROAM_RESEARCH_PASSWORD,
      },
    },
  ],
};
```

### Offline

If you don't have internet connection you can add `export GATSBY_ROAM_RESEARCH_OFFLINE=true` to tell the plugin to fallback to the cached data, if there is any.

### Configuration options

**`url`** [string][required]

Url to the Roam Research database

**`email`** [string][required]

Email used to sign into Roam Research

**`password`** [string][required]

Password used to sign into Roam Research

<!-- ## How to query for nodes

Two standard node types are available from Roam Research: `Page` and `Block`.

`Asset` nodes will be created in your site's GraphQL schema under `contentfulAsset` and `allContentfulAsset`.

`ContentType` nodes are a little different - their exact name depends on what you called them in your Contentful data models. The nodes will be created in your site's GraphQL schema under `contentful${entryTypeName}` and `allContentful${entryTypeName}`.

In all cases querying for nodes like `contentfulX` will return a single node, and nodes like `allContentfulX` will return all nodes of that type.

### Query for all nodes

You might query for **all** of a type of node:

```graphql
{
  allContentfulAsset {
    edges {
      node {
        id
        file {
          url
        }
      }
    }
  }
}
```

You might do this in your `gatsby-node.js` using Gatsby's [`createPages`](https://next.gatsbyjs.org/docs/node-apis/#createPages) Node API.

### Query for a single node

To query for a single `image` asset with the title 'foo' and a width of 1600px:

```javascript
export const assetQuery = graphql`
  {
    contentfulAsset(filter: { title: { eq: 'foo' } }) {
      image {
        resolutions(width: 1600) {
          width
          height
          src
          srcSet
        }
      }
    }
  }
`;
```

To query for a single `CaseStudy` node with the short text properties `title` and `subtitle`:

```graphql
  {
    contentfulCaseStudy(filter: { title: { eq: 'bar' } })  {
      title
      subtitle
    }
  }
```

> Note the use of [GraphQL arguments](https://graphql.org/learn/queries/#arguments) on the `contentfulAsset` and `resolutions` fields. See [Gatsby's GraphQL reference docs for more info](https://www.gatsbyjs.org/docs/graphql-reference/).

You might query for a **single** node inside a component in your `src/components` folder, using [Gatsby's `StaticQuery` component](https://www.gatsbyjs.org/docs/static-query/).

#### A note about LongText fields

On Contentful, a "Long text" field uses Markdown by default. The field is exposed as an object, while the raw Markdown is exposed as a child node.

```graphql
{
  contentfulCaseStudy {
    body {
      body
    }
  }
}
```

Unless the text is Markdown-free, you cannot use the returned value directly. In order to handle the Markdown content, you must use a transformer plugin such as [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/). The transformer will create a childMarkdownRemark on the "Long text" field and expose the generated html as a child node:

```graphql
{
  contentfulCaseStudy {
    body {
      childMarkdownRemark {
        html
      }
    }
  }
}
```

You can then insert the returned HTML inline in your JSX:

```jsx
<div
  className="body"
  dangerouslySetInnerHTML={{
    __html: data.contentfulCaseStudy.body.childMarkdownRemark.html,
  }}
/>
``` -->

## Sourcing From Multiple Roam Research databases

To source from multiple Roam Research databases, add another configuration for `gatsby-source-roamresearch` in `gatsby-config.js`:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-roamresearch`,
      options: {
        url: `https://roamresearch.com/#/app/YOUR_DATABASE_HERE`,
        email: process.env.ROAM_RESEARCH_EMAIL,
        password: process.env.ROAM_RESEARCH_PASSWORD,
      },
    },
    {
      resolve: `gatsby-source-roamresearch`,
      options: {
        url: `https://roamresearch.com/#/app/YOUR_SECOND_DATABASE_HERE`,
        email: process.env.ROAM_RESEARCH_SECOND_EMAIL,
        password: process.env.ROAM_RESEARCH_SECOND_PASSWORD,
      },
    },
  ],
};
```

[dotenv]: https://github.com/motdotla/dotenv
[envvars]: https://gatsby.dev/env-vars
