import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";
import Note from "../components/Note";

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

export default PageTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamPage(id: { eq: $id }) {
      title
      childMdx {
        body
        ...References
      }
      fields {
        slug
      }
    }
  }
`;
