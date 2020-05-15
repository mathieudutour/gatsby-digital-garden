import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "../layouts";
import Reference from "../components/Reference";

const propTypes = {
  data: PropTypes.object.isRequired,
};

class BlockTemplate extends React.Component {
  render() {
    const roamBlock = this.props.data.roamBlock;
    return (
      <Layout>
        <Reference node={roamBlock.fields.parentPage} withoutSeparation />
        <MDXRenderer>{roamBlock.fields.markdown.childMdx.body}</MDXRenderer>
        {roamBlock.fields.inboundReferences.length ? (
          <div>
            <hr />
            <h3>References to this block</h3>
            {roamBlock.fields.inboundReferences.map((node) => (
              <Reference node={node} key={node.id} />
            ))}
          </div>
        ) : null}
      </Layout>
    );
  }
}

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
        inboundReferences {
          ... on RoamBlock {
            id
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
  }
`;
