import { graphql } from "gatsby";

export const references = graphql`
  fragment GatsbyGardenReferences on Mdx {
    outboundReferences {
      ... on Mdx {
        body
        frontmatter {
          aliases
        }
        parent {
          id
          ... on File {
            fields {
              slug
              title
            }
          }
        }
      }
    }
    inboundReferences {
      ... on Mdx {
        body
        parent {
          id
          ... on File {
            fields {
              slug
              title
            }
          }
        }
      }
    }
  }
`;
