import React from "react";
import { Link } from "gatsby";
import { rhythm } from "../utils/typography";

const Reference = ({ node, withoutSeparation }) => (
  <div>
    <Link
      style={{ color: `inherit`, textDecoration: `none` }}
      to={`${node.fields.slug}/`}
    >
      <div
        style={{
          display: `flex`,
          alignItems: `center`,
          borderBottom: withoutSeparation ? `0` : `1px solid lightgray`,
          paddingBottom: rhythm(1 / 2),
          marginBottom: rhythm(1 / 2),
        }}
      >
        <div style={{ flex: 1 }}>{node.title || node.string}</div>
      </div>
    </Link>
  </div>
);

export default Reference;
