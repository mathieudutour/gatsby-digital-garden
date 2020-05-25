import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";

const MarkdownTemplate = ({ data, location }) => {
  const file = data.file;
  return <Layout location={location} slug={file.fields.slug} data={data} />;
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
