import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import Layout from "../layouts";
import Note from "../components/Note";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const PageTemplate = ({ data, location }) => {
  const roamPage = data.roamPage;

  return (
    <Layout location={location}>
      <Note
        mdx={roamPage.fields.allMarkdown.childMdx.body}
        outboundReferences={roamPage.fields.allOutboundReferences}
        inboundReferences={roamPage.fields.inboundReferences}
      />
    </Layout>
  );
};

PageTemplate.propTypes = propTypes;

export default PageTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamPage(id: { eq: $id }) {
      fields {
        allMarkdown {
          childMdx {
            body
          }
        }
        allOutboundReferences {
          ... on RoamBlock {
            id
            uid
            string
            fields {
              parentPage {
                title
              }
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
          ... on RoamPage {
            id
            title
            fields {
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
        }
        inboundReferences {
          ... on RoamBlock {
            id
            string
            fields {
              parentPage {
                title
              }
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
          ... on RoamPage {
            id
            title
            fields {
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
        }
      }
    }
  }
`;
