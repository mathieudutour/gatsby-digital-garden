# gatsby-transformer-markdown-references

Transformer plugin to extract references between markdown nodes. You can then use them to create bi-directional links.

An example site for using this plugin is at [https://mathieudutour.github.io/gatsby-digital-garden/](https://mathieudutour.github.io/gatsby-digital-garden/)

## Install

```shell
npm install --save gatsby-transformer-markdown-references
```

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    // after a markdown or Mdx transformer
    {
      resolve: `gatsby-transformer-markdown-references`,
      options: {
        types: ["Mdx"], // or ["MarkdownRemark"] (or both)
      },
    },
  ],
};
```

### Configuration options

**`types`** [Array<string>][optional]

The types of the nodes to transform. Defaults to `['Mdx']`

## How to query for references

Two types of references are available: `outboundReferences` and `inboundReferences`.

The fields will be created in your site's GraphQL schema on the nodes of types specified in the options.

```graphql
{
  allMdx {
    outboundReferences {
      ... on Mdx {
        id
        parent {
          id
        }
      }
    }
    inboundReferences {
      ... on Mdx {
        id
        parent {
          id
          ... on RoamPage {
            title
          }
        }
      }
    }
  }
}
```
