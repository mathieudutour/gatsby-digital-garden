import React from "react";
import { Link } from "gatsby";

import "./Reference.css";

const Reference = ({ node }) => {
  if (node.title) {
    return (
      <div>
        <Link to={node.fields.slug} className="reference">
          <div>
            <h5>{node.title}</h5>
          </div>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Link to={node.fields.slug} className="reference">
        <div>
          <h5>{node.fields.parentPage.title}</h5>
          <ul>
            <li>{node.string}</li>
          </ul>
        </div>
      </Link>
    </div>
  );
};

export default Reference;
