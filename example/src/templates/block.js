import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";
import Note from "../components/Note";
import { dataToNote } from "../layouts/data-to-note";

const BlockTemplate = ({ data, location }) => {
  const roamBlock = data.roamBlock;

  return (
    <Layout
      location={location}
      slug={roamBlock.fields.slug}
      title={roamBlock.fields.parentPage.title}
    >
      <Note {...dataToNote(data)} />
    </Layout>
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
