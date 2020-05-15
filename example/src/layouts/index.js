import React from "react";
import { Link } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import * as PropTypes from "prop-types";

import "./layout.css";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const DefaultLayout = ({ children }) => (
  <div className="layout">
    <header>
      <Link to="/">
        <h3>
          Example of using Roam Research as a data source for a Gatsby site
        </h3>
      </Link>
    </header>

    <MDXProvider>{children}</MDXProvider>

    <footer>
      The source for this website is on
      {` `}
      <a href="https://github.com/mathieudutour/gatsby-n-roamresearch/tree/master/example">
        GitHub
      </a>
      .
    </footer>
  </div>
);

DefaultLayout.propTypes = propTypes;

export default DefaultLayout;
