import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import components from "../components/MdxComponents";
import Layout from "../layouts";
import ReferencesBlock from "../components/ReferencesBlock";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const PageTemplate = ({ data }) => {
  const roamPage = data.roamPage;

  const AnchorTag = (props) => (
    <components.a
      {...props}
      references={roamPage.fields.allOutboundReferences}
    />
  );

  return (
    <Layout>
      <MDXProvider components={{ ...components, a: AnchorTag }}>
        <MDXRenderer>{roamPage.fields.markdown.childMdx.body}</MDXRenderer>
      </MDXProvider>
      <ReferencesBlock references={roamPage.fields.inboundReferences} />
    </Layout>
  );
};

PageTemplate.propTypes = propTypes;

export default PageTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamPage(id: { eq: $id }) {
      fields {
        markdown {
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
                  excerpt
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
                  excerpt
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
                  excerpt
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
                  excerpt
                }
              }
            }
          }
        }
      }
    }
  }
`;
