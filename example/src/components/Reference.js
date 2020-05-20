import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";

import "./Reference.css";

const Reference = ({ node }) => {
  if (!node.fields.parentPage) {
    return (
      <div>
        <LinkToStacked to={node.fields.slug} className="reference">
          <div>
            <h5>{node.title}</h5>
          </div>
        </LinkToStacked>
      </div>
    );
  }

  return (
    <div>
      <LinkToStacked
        to={node.fields.parentPage.fields.slug}
        className="reference"
      >
        <div>
          <h5>{node.fields.parentPage.title}</h5>
          <ul>
            <li>{node.string}</li>
          </ul>
        </div>
      </LinkToStacked>
    </div>
  );
};

export default Reference;
