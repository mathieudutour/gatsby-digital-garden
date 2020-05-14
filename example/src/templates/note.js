import React from "react";
import { Link, graphql } from "gatsby";
import * as PropTypes from "prop-types";
import { rhythm } from "../utils/typography";
import Layout from "../layouts";

const propTypes = {
  data: PropTypes.object.isRequired,
};

class NoteTemplate extends React.Component {
  render() {
    const roamPage = this.props.data.roamPage;
    return (
      <Layout>
        <div
          dangerouslySetInnerHTML={{
            __html: roamPage.fields.markdown.childMarkdownRemark.html,
          }}
        />
        <hr />
        <h3>References to this note</h3>
        {roamPage.fields.inboundReferences.map((ref) => (
          <div>
            <Link
              style={{ color: `inherit`, textDecoration: `none` }}
              to={`${ref.fields.slug}/`}
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
                <div style={{ flex: 1 }}>{ref.title}</div>
              </div>
            </Link>
          </div>
        ))}
      </Layout>
    );
  }
}

NoteTemplate.propTypes = propTypes;

export default NoteTemplate;

export const pageQuery = graphql`
  query($id: String!) {
    roamPage(id: { eq: $id }) {
      fields {
        markdown {
          childMarkdownRemark {
            html
          }
        }
        inboundReferences {
          title
          fields {
            slug
          }
        }
      }
    }
  }
`;
