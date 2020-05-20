import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import components from "./MdxComponents";
import ReferencesBlock from "./ReferencesBlock";
import { MagicLink } from "./MagicLink";

const Note = (data) => {
  const index = data.index || 0;

  const AnchorTag = (props) => (
    <components.a
      {...props}
      references={data.outboundReferences}
      index={index}
    />
  );

  return (
    <React.Fragment>
      {data.partOf ? (
        <div>
          Part of{" "}
          <MagicLink to={data.partOf.slug} index={index - 1}>
            {data.partOf.title}
          </MagicLink>
        </div>
      ) : null}
      <MDXProvider components={{ ...components, a: AnchorTag }}>
        <MDXRenderer>{data.mdx}</MDXRenderer>
      </MDXProvider>
      <ReferencesBlock references={data.inboundReferences} index={index} />
    </React.Fragment>
  );
};

export default Note;
