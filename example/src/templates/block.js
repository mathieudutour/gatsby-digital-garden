import React from "react";
import { graphql, Link } from "gatsby";
import * as PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import components from "../components/MdxComponents";
import Layout from "../layouts";
import ReferencesBlock from "../components/ReferencesBlock";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const BlockTemplate = ({ data }) => {
  const roamBlock = data.roamBlock;

  const AnchorTag = (props) => (
    <components.a
      {...props}
      references={roamBlock.fields.allOutboundReferences}
    />
  );

  return (
    <Layout>
      <div>
        Part of{" "}
        <Link to={roamBlock.fields.parentPage.fields.slug}>
          {roamBlock.fields.parentPage.title}
        </Link>
      </div>
      <MDXProvider components={{ ...components, a: AnchorTag }}>
        <MDXRenderer>{roamBlock.fields.markdown.childMdx.body}</MDXRenderer>
      </MDXProvider>
      <ReferencesBlock references={roamBlock.fields.inboundReferences} />
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
