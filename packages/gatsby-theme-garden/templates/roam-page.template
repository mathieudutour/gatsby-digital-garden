import { graphql } from "gatsby";

import StackedLayout from "../components/stacked-layout";

export default StackedLayout;

export const pageQuery = graphql`
  query($id: String!) {
    roamPage(id: { eq: $id }) {
      title
      childMdx {
        body
        ...GatsbyGardenReferences
      }
      fields {
        slug
      }
    }
  }
`;
