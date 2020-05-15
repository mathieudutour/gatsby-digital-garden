import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import Layout from "../layouts";
import Reference from "../components/Reference";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const IndexPage = ({ data }) => {
  const roamPages = data.allRoamPage.nodes;
  return (
    <Layout>
      <div>
        <h3>Notes</h3>
        {roamPages.map((node) => (
          <Reference node={node} key={node.id} />
        ))}
      </div>
    </Layout>
  );
};

IndexPage.propTypes = propTypes;

export default IndexPage;

export const pageQuery = graphql`
  query {
    allRoamPage {
      nodes {
        id
        title
        fields {
          slug
        }
      }
    }
  }
`;
