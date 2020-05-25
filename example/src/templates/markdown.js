import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";
import Note from "../components/Note";
import { dataToNote } from "../layouts/data-to-note";

const MarkdownTemplate = ({ data, location }) => {
  const file = data.file;

  return (
    <Layout
      location={location}
      slug={file.fields.slug}
      title={file.childMdx.frontmatter.title}
    >
      <Note {...dataToNote(data)} />
    </Layout>
  );
};

export default MarkdownTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    file(id: { eq: $id }) {
      childMdx {
        body
        frontmatter {
          title
        }
        ...References
      }
      fields {
        slug
      }
    }
  }
`;
