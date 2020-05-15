import React from "react";
import Reference from "./Reference";

import "./ReferencesBlock.css";

const ReferencesBlock = ({ references }) => {
  if (!references.length) {
    return (
      <div className="references-block">
        <p>
          If you think this note resonated, be it positive or negative,
          <a href="https://twitter.com/mathieudutour">ping me</a> on Twitter.
        </p>
      </div>
    );
  }

  return (
    <div className="references-block">
      <h3>Referred in</h3>
      <div>
        {references.map((ref) => (
          <Reference node={ref} key={ref.id} />
        ))}
      </div>
      <hr />
      <p>
        If you think this note resonated, be it positive or negative,{" "}
        <a href="https://twitter.com/mathieudutour">ping me</a> on Twitter.
      </p>
    </div>
  );
};

export default ReferencesBlock;
