import React from "react";
import Tippy from "@tippyjs/react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { LinkToStacked } from "react-stacked-pages-hook";

import "./MdxComponents.css";

const AnchorTag = ({
  title,
  href,
  references = [],
  withoutLink,
  ...restProps
}) => {
  const ref = references.find(
    (x) =>
      x.parent.uid === (title || "").replace("__roam_block_", "") ||
      (x.parent.title && x.parent.title === title)
  );

  if (ref) {
    const nestedComponents = {
      a(props) {
        return <AnchorTag {...props} references={references} withoutLink />;
      },
      p(props) {
        return <span {...props} />;
      },
    };
    const content = ref.parent.title ? (
      restProps.children
    ) : (
      <MDXProvider components={nestedComponents}>
        <MDXRenderer>{ref.body}</MDXRenderer>
      </MDXProvider>
    );
    if (withoutLink) {
      return <span>{content}</span>;
    }
    return (
      <Tippy
        content={
          <div id={ref.parent.id} className="popover with-markdown">
            {ref.parent.title ? (
              <React.Fragment>
                <MDXProvider components={nestedComponents}>
                  <MDXRenderer>{ref.body}</MDXRenderer>
                </MDXProvider>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h5>{ref.parent.fields.parentPage.title}</h5>
                <ul>
                  <li>
                    <MDXProvider components={nestedComponents}>
                      <MDXRenderer>{ref.body}</MDXRenderer>
                    </MDXProvider>
                  </li>
                </ul>
              </React.Fragment>
            )}
          </div>
        }
        animation="shift-away"
      >
        <LinkToStacked {...restProps} to={href} title={title}>
          {content}
        </LinkToStacked>
      </Tippy>
    );
  }

  if (withoutLink) {
    return <span>{restProps.children}</span>;
  }

  return (
    <Tippy
      animation="shift-away"
      maxWidth="none"
      content={<div className="popover no-max-width">{href}</div>}
    >
      <a {...restProps} href={href} title={title} />
    </Tippy>
  );
};

export default {
  a: AnchorTag,
};
