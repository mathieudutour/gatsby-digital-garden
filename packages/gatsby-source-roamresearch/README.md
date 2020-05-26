# gatsby-source-roamresearch

Source plugin for pulling data into Gatsby from Roam Research. It creates links between pages so they can be queried in Gatsby using GraphQL.

An example site for using this plugin is at [https://mathieudutour.github.io/gatsby-digital-garden/](https://mathieudutour.github.io/gatsby-digital-garden/)

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
      resolve: `gatsby-source-roamresearch`,
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

<!-- ### Offline

If you don't have internet connection you can add `export GATSBY_ROAM_RESEARCH_OFFLINE=true` to tell the plugin to fallback to the cached data, if there is any. -->

### Configuration options

**`url`** [string][required]

Url to the Roam Research database

**`email`** [string][required]

Email used to sign into Roam Research

**`password`** [string][required]

Password used to sign into Roam Research

## How to query for nodes

Two standard node types are available from Roam Research: `Page` and `Block`.

The nodes will be created in your site's GraphQL schema under `roam${entryTypeName}` and `allRoam${entryTypeName}`.

In all cases querying for nodes like `roamX` will return a single node, and nodes like `allRoamX` will return all nodes of that type.

### Query for all nodes

You might query for **all** of a type of node:

```graphql
{
  allRoamPage {
    nodes {
      id
      title
    }
  }
}
```

You might do this in your `gatsby-node.js` using Gatsby's [`createPages`](https://next.gatsbyjs.org/docs/node-apis/#createPages) Node API.

### Query for a single node

To query for a single `block` with the id 'foo':

```javascript
export const blockQuery = graphql`
  {
    roamBlock(id: "foo") {
      string
    }
  }
`;
```

You might query for a **single** node inside a component in your `src/components` folder, using [Gatsby's `StaticQuery` component](https://www.gatsbyjs.org/docs/static-query/).

#### A note about markdown fields

Roam Research uses Markdown for its formatting.

In order to handle the Markdown content, you must use a transformer plugin such as [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/) or [gatsby-plugin-mdx](https://www.gatsbyjs.org/packages/gatsby-plugin-mdx/). The transformer will create a childMarkdownRemark field on the node and expose the generated html as a child node:

```graphql
{
  roamBlock {
    childMarkdownRemark {
      html
    }
  }
}
```

You can then insert the returned HTML inline in your JSX:

```jsx
<div
  className="body"
  dangerouslySetInnerHTML={{
    __html: data.roamBlock.childMarkdownRemark.html,
  }}
/>
```

> Note that Roam Research uses some non-standard syntax for its internal links, so you will need some additional plugins to handle them (for example [gatsby-remark-double-brackets-link](../gatsby-remark-double-brackets-link) and [gatsby-remark-double-parenthesis-link](../gatsby-remark-double-parenthesis-link)).
>
> In order to extract the references between the nodes, you can use [gatsby-transformer-markdown-references](../gatsby-transformer-markdown-references).

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
