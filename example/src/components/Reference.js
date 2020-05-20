import React from "react";
import { MagicLink } from "./MagicLink";

import "./Reference.css";

const Reference = ({ node, index }) => {
  if (node.title) {
    return (
      <div>
        <MagicLink to={node.fields.slug} index={index} className="reference">
          <div>
            <h5>{node.title}</h5>
          </div>
        </MagicLink>
      </div>
    );
  }
  return (
    <div>
      <MagicLink to={node.fields.slug} index={index} className="reference">
        <div>
          <h5>{node.fields.parentPage.title}</h5>
          <ul>
            <li>{node.string}</li>
          </ul>
        </div>
      </MagicLink>
    </div>
  );
};

export default Reference;
