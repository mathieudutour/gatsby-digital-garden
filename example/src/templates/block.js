import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";

const BlockTemplate = ({ data, location }) => {
  const roamBlock = data.roamBlock;
  return (
    <Layout location={location} slug={roamBlock.fields.slug} data={data} />
  );
};

export default BlockTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamBlock(id: { eq: $id }) {
      childMdx {
        body
        ...References
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
