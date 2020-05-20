import React, { useRef, useCallback } from "react";
import { Link } from "gatsby";
import * as PropTypes from "prop-types";
import Note from "../components/Note";
import { useWindowSize } from "../hooks/use-window-size";
import { useStackedPagesProvider } from "react-stacked-pages-hook";

import "./layout.css";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const NoteWrapper = ({ note, i }) => (
  <div className="note-container" style={{ left: 40 * (i || 0), right: -585 }}>
    <Note {...note} />
  </div>
);

const NotesLayout = ({ children, location }) => {
  const windowSize = useWindowSize();
  const scrollContainer = useRef();
  const processPageQuery = useCallback(
    (x) =>
      x.json.data.roamPage
        ? {
            mdx: x.json.data.roamPage.fields.allMarkdown.childMdx.body,
            outboundReferences:
              x.json.data.roamPage.fields.allOutboundReferences,
            inboundReferences: x.json.data.roamPage.fields.inboundReferences,
          }
        : x.json.data.roamBlock
        ? {
            mdx: x.json.data.roamBlock.fields.allMarkdown.childMdx.body,
            outboundReferences:
              x.json.data.roamBlock.fields.allOutboundReferences,
            inboundReferences: x.json.data.roamBlock.fields.inboundReferences,
            partOf: {
              slug: x.json.data.roamBlock.fields.parentPage.fields.slug,
              title: x.json.data.roamBlock.fields.parentPage.title,
            },
          }
        : null,
    []
  );

  const [
    stackedPages,
    navigateToStackedPage,
    ContextProvider,
    PageIndexProvider,
  ] = useStackedPagesProvider({
    firstPageSlug: "/About-these-notes",
    location,
    processPageQuery,
    containerRef: scrollContainer,
    pageWidth: 625,
  });

  return (
    <div className="layout">
      <header>
        <Link to="/">
          <h3>
            Example of using Roam Research as a data source for a Gatsby site
          </h3>
        </Link>
      </header>

      <div className="note-columns-scrolling-container" ref={scrollContainer}>
        <div
          className="note-columns-container"
          style={{ width: 625 * (stackedPages.length + 1) }}
        >
          <ContextProvider value={{ stackedPages, navigateToStackedPage }}>
            {windowSize.width > 800 ? (
              <React.Fragment>
                <div
                  className="note-container"
                  style={{ left: 0, right: -585 }}
                >
                  {children}
                </div>
                {stackedPages.map((page, i) => (
                  <PageIndexProvider value={i + 1} key={page.slug}>
                    <NoteWrapper i={i + 1} note={page.data} />
                  </PageIndexProvider>
                ))}
              </React.Fragment>
            ) : !stackedPages.length ? (
              <div className="note-container" style={{ left: 0, right: -585 }}>
                {children}
              </div>
            ) : (
              <PageIndexProvider value={stackedPages.length - 1}>
                <NoteWrapper
                  note={stackedPages[stackedPages.length - 1].data}
                />
              </PageIndexProvider>
            )}
          </ContextProvider>
        </div>
      </div>

      {/*<footer>
      The source for this website is on
      {` `}
      <a href="https://github.com/mathieudutour/gatsby-n-roamresearch/tree/master/example">
        GitHub
      </a>
      .
    </footer>*/}
    </div>
  );
};

NotesLayout.propTypes = propTypes;

export default NotesLayout;
