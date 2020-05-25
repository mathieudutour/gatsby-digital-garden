import React from "react";
import Reference from "./Reference";

import "./ReferencesBlock.css";

const ReferencesBlock = ({ references }) => {
  const footer = (
    <React.Fragment>
      <p>
        If you think this note resonated, be it positive or negative,{" "}
        <a href="https://twitter.com/mathieudutour">ping me</a> on Twitter.
      </p>
      <p>
        The source for this website is on
        {` `}
        <a href="https://github.com/mathieudutour/gatsby-n-roamresearch/tree/master/example">
          GitHub
        </a>
        .
      </p>
    </React.Fragment>
  );

  if (!references.length) {
    return <div className="references-block">{footer}</div>;
  }

  return (
    <div className="references-block">
      <h3>Referred in</h3>
      <div>
        {references.map((ref) => (
          <Reference node={ref} key={ref.parent.id} />
        ))}
      </div>
      <hr />
      {footer}
    </div>
  );
};

export default ReferencesBlock;
