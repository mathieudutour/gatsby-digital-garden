import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";
import Note from "../components/Note";

const MarkdownTemplate = ({ data, location }) => {
  const file = data.file;

  return (
    <Layout
      location={location}
      slug={file.fields.slug}
      title={file.childMdx.frontmatter.title}
    >
      <Note
        mdx={file.childMdx.body}
        outboundReferences={file.childMdx.outboundReferences}
        inboundReferences={file.childMdx.inboundReferences}
      />
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
