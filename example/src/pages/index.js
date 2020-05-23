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
  query {
    roamPage(title: { eq: "About these notes" }) {
      title
      childMdx {
        body
        outboundReferences {
          ... on Mdx {
            body
            parent {
              ... on RoamBlock {
                id
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
                id
                title
                fields {
                  slug
                }
              }
            }
          }
        }
        inboundReferences {
          ... on Mdx {
            body
            parent {
              ... on RoamBlock {
                id
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
                id
                title
                fields {
                  slug
                }
              }
            }
          }
        }
      }
      fields {
        slug
      }
    }
  }
`;
