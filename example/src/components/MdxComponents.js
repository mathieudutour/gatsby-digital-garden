import React from "react";
import { Link } from "gatsby";
import Tippy from "@tippyjs/react";

import "./MdxComponents.css";

const AnchorTag = ({ href, title, references = [], ...restProps }) => {
  const ref = references.find(
    (x) =>
      x.uid === (title || "").replace("__roam_block_", "") ||
      (x.title && x.title === title)
  );

  if (ref) {
    return (
      <Tippy
        content={
          <div id={ref.id} className="popover">
            {ref.title ? (
              <React.Fragment>
                <h5>{ref.title}</h5>
                <p>{ref.fields.markdown.childMdx.excerpt}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h5>{ref.fields.parentPage.title}</h5>
                <ul>
                  <li>{ref.string}</li>
                </ul>
              </React.Fragment>
            )}
          </div>
        }
        animation="shift-away"
      >
        <Link
          {...restProps}
          to={href}
          title={title}
          children={ref.title ? restProps.children : ref.string}
        />
      </Tippy>
    );
  }

  return (
    <Tippy
      animation="shift-away"
      maxWidth="none"
      content={<div className="popover">{href}</div>}
    >
      <a {...restProps} href={href} title={title} />
    </Tippy>
  );
};

export default {
  a: AnchorTag,
};
