import React from "react";
import { Link, graphql } from "gatsby";
import * as PropTypes from "prop-types";
import { rhythm } from "../utils/typography";
import Layout from "../layouts";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const Note = ({ node }) => (
  <div>
    <Link
      style={{ color: `inherit`, textDecoration: `none` }}
      to={`${node.fields.slug}/`}
    >
      <div
        style={{
          display: `flex`,
          alignItems: `center`,
          borderBottom: `1px solid lightgray`,
          paddingBottom: rhythm(1 / 2),
          marginBottom: rhythm(1 / 2),
        }}
      >
        <div style={{ flex: 1 }}>{node.title}</div>
      </div>
    </Link>
  </div>
);

class IndexPage extends React.Component {
  render() {
    const roamPages = this.props.data.allRoamPage.nodes;
    return (
      <Layout>
        <div style={{ marginBottom: rhythm(2) }}>
          <h3>Notes</h3>
          {roamPages.map((node) => (
            <Note node={node} key={node.id} />
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
