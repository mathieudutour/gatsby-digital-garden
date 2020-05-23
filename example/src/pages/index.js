import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import Page from "../templates/page";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const IndexPage = ({ data, location }) => {
  return <Page data={data} location={location} />;
};

IndexPage.propTypes = propTypes;

export default IndexPage;

export const pageQuery = graphql`
  fragment References on Mdx {
    outboundReferences {
      ... on Mdx {
        body
        parent {
          id
          ... on RoamBlock {
            uid
            string
            fields {
              parentPage {
                title
              }
              slug
            }
          }
          ... on RoamPage {
            title
            fields {
              slug
            }
          }
          ... on File {
            fields {
              slug
            }
            childMdx {
              frontmatter {
                title
              }
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
          ... on RoamBlock {
            string
            fields {
              parentPage {
                title
                fields {
                  slug
                }
              }
              slug
            }
          }
          ... on RoamPage {
            title
            fields {
              slug
            }
          }
          ... on File {
            fields {
              slug
            }
            childMdx {
              frontmatter {
                title
              }
            }
          }
        }
      }
    }
  }

  query {
    roamPage(title: { eq: "About these notes" }) {
      title
      childMdx {
        body
        ...References
      }
      fields {
        slug
      }
    }
  }
`;
