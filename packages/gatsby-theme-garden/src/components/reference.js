import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";

import "./reference.css";

const Reference = ({ node }) => {
  return (
    <div>
      <LinkToStacked to={node.slug} className="reference">
        <div>
          <h5>{node.title}</h5>
          {node.content}
        </div>
      </LinkToStacked>
    </div>
  );
};

export default Reference;
