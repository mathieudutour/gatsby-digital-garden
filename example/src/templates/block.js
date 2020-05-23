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
    <Layout
      location={location}
      slug={roamBlock.fields.slug}
      title={roamBlock.fields.parentPage.title}
    >
      <Note
        partOf={{
          slug: roamBlock.fields.parentPage.fields.slug,
          title: roamBlock.fields.parentPage.title,
        }}
        mdx={roamBlock.childMdx.body}
        outboundReferences={roamBlock.childMdx.outboundReferences}
        inboundReferences={roamBlock.childMdx.inboundReferences}
      />
    </Layout>
  );
};

BlockTemplate.propTypes = propTypes;

export default BlockTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamBlock(id: { eq: $id }) {
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
        parentPage {
          title
          fields {
            slug
          }
        }
      }
    }
  }
`;
