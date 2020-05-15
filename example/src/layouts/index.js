import React from "react";
import { Link } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import * as PropTypes from "prop-types";

import { rhythm } from "../utils/typography";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const DefaultLayout = ({ children }) => (
  <div
    style={{
      margin: `0 auto`,
      marginTop: rhythm(1.5),
      marginBottom: rhythm(1.5),
      maxWidth: 650,
      paddingLeft: rhythm(3 / 4),
      paddingRight: rhythm(3 / 4),
    }}
  >
    <Link style={{ textDecoration: `none` }} to="/">
      <h3 style={{ color: `tomato`, marginBottom: rhythm(1.5) }}>
        Example of using Roam Research as a data source for a Gatsby site
      </h3>
    </Link>
    <MDXProvider>{children}</MDXProvider>
    <hr style={{ marginTop: rhythm(3) }} />
    <p>
      The src for this website is at
      {` `}
      <a href="https://github.com/mathieudutour/gatsby-n-roamresearch/tree/master/example">
        https://github.com/mathieudutour/gatsby-n-roamresearch/tree/master/example
      </a>
    </p>
  </div>
);

DefaultLayout.propTypes = propTypes;

export default DefaultLayout;
