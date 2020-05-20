import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import Layout from "../layouts";
import Note from "../components/Note";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const BlockTemplate = ({ data, location }) => {
  const roamBlock = data.roamBlock;

  return (
    <Layout location={location}>
      <Note
        partOf={{
          slug: roamBlock.fields.parentPage.fields.slug,
          title: roamBlock.fields.parentPage.title,
        }}
        mdx={roamBlock.fields.allMarkdown.childMdx.body}
        outboundReferences={roamBlock.fields.allOutboundReferences}
        inboundReferences={roamBlock.fields.inboundReferences}
      />
    </Layout>
  );
};

BlockTemplate.propTypes = propTypes;

export default BlockTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamBlock(id: { eq: $id }) {
      fields {
        parentPage {
          title
          fields {
            slug
          }
        }
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
