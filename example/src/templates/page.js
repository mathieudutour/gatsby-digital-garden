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
    <Layout
      location={location}
      slug={roamPage.fields.slug}
      title={roamPage.title}
    >
      <Note
        mdx={roamPage.childMdx.body}
        outboundReferences={roamPage.childMdx.outboundReferences}
        inboundReferences={roamPage.childMdx.inboundReferences}
      />
    </Layout>
  );
};

PageTemplate.propTypes = propTypes;

export default PageTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamPage(id: { eq: $id }) {
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
