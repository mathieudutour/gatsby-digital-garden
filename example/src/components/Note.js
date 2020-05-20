import React from "react";
import { Link } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import components from "./MdxComponents";
import ReferencesBlock from "./ReferencesBlock";

const Note = (data) => {
  const AnchorTag = (props) => (
    <components.a
      {...props}
      references={data.outboundReferences}
      index={data.index || 0}
    />
  );

  return (
    <React.Fragment>
      {data.partOf ? (
        <div>
          Part of <Link to={data.partOf.slug}>{data.partOf.title}</Link>
        </div>
      ) : null}
      <MDXProvider components={{ ...components, a: AnchorTag }}>
        <MDXRenderer>{data.mdx}</MDXRenderer>
      </MDXProvider>
      <ReferencesBlock references={data.inboundReferences} />
    </React.Fragment>
  );
};

export default Note;
