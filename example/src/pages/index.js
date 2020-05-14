import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import { rhythm } from "../utils/typography";
import Layout from "../layouts";
import Reference from "../components/Reference";

const propTypes = {
  data: PropTypes.object.isRequired,
};

class IndexPage extends React.Component {
  render() {
    const roamPages = this.props.data.allRoamPage.nodes;
    return (
      <Layout>
        <div style={{ marginBottom: rhythm(2) }}>
          <h3>Notes</h3>
          {roamPages.map((node) => (
            <Reference node={node} key={node.id} />
          ))}
        </div>
      </Layout>
    );
  }
}

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
