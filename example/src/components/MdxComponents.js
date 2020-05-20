import React from "react";
import { Link, navigate, withPrefix } from "gatsby";
import Tippy from "@tippyjs/react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import qs from "querystring";

import "./MdxComponents.css";

const AnchorTag = ({
  href,
  title,
  references = [],
  withoutLink,
  index,
  ...restProps
}) => {
  const ref = references.find(
    (x) =>
      x.uid === (title || "").replace("__roam_block_", "") ||
      (x.title && x.title === title)
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
    const content = ref.title ? (
      restProps.children
    ) : (
      <MDXProvider components={nestedComponents}>
        <MDXRenderer>{ref.fields.markdown.childMdx.body}</MDXRenderer>
      </MDXProvider>
    );
    if (withoutLink) {
      return <span>{content}</span>;
    }
    return (
      <Tippy
        content={
          <div id={ref.id} className="popover">
            {ref.title ? (
              <React.Fragment>
                <h5>{ref.title}</h5>
                <p>
                  <MDXProvider components={nestedComponents}>
                    <MDXRenderer>
                      {ref.fields.markdown.childMdx.body}
                    </MDXRenderer>
                  </MDXProvider>
                </p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h5>{ref.fields.parentPage.title}</h5>
                <ul>
                  <li>
                    <MDXProvider components={nestedComponents}>
                      <MDXRenderer>
                        {ref.fields.markdown.childMdx.body}
                      </MDXRenderer>
                    </MDXProvider>
                  </li>
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
          children={content}
          onClick={(ev) => {
            ev.preventDefault();
            const search = qs.parse(window.location.search.replace(/^\?/, ""));
            let stackedNotes = search.stackedNotes || [];
            if (typeof stackedNotes === "string") {
              stackedNotes = [stackedNotes];
            }
            stackedNotes.splice(index, stackedNotes.length - index, href);
            search.stackedNotes = stackedNotes;
            navigate(
              `${window.location.pathname.replace(
                withPrefix(""),
                ""
              )}?${qs.stringify(search)}`
            );
          }}
        />
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
