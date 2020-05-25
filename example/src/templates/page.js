import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";
import Note from "../components/Note";
import { dataToNote } from "../layouts/data-to-note";

const PageTemplate = ({ data, location }) => {
  const roamPage = data.roamPage;

  return (
    <Layout
      location={location}
      slug={roamPage.fields.slug}
      title={roamPage.title}
    >
      <Note {...dataToNote(data)} />
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
