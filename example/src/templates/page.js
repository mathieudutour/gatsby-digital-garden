import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";

const PageTemplate = ({ data, location }) => {
  const roamPage = data.roamPage;
  return <Layout location={location} slug={roamPage.fields.slug} data={data} />;
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
