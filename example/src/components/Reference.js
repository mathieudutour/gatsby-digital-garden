import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";

import "./Reference.css";

const Reference = ({ node }) => {
  if (!node.parent.fields.parentPage) {
    return (
      <div>
        <LinkToStacked to={node.parent.fields.slug} className="reference">
          <div>
            <h5>{node.parent.title}</h5>
          </div>
        </LinkToStacked>
      </div>
    );
  }

  return (
    <div>
      <LinkToStacked
        to={node.parent.fields.parentPage.fields.slug}
        className="reference"
      >
        <div>
          <h5>{node.parent.fields.parentPage.title}</h5>
          <ul>
            <li>{node.parent.string}</li>
          </ul>
        </div>
      </LinkToStacked>
    </div>
  );
};

export default Reference;
