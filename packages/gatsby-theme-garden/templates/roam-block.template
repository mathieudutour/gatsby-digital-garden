import { graphql } from "gatsby";

import StackedLayout from "../components/stacked-layout";

export default StackedLayout;

export const pageQuery = graphql`
  query($id: String!) {
    roamBlock(id: { eq: $id }) {
      childMdx {
        body
        ...GatsbyGardenReferences
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
