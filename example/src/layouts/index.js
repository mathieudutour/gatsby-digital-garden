import React, { useRef, useCallback } from "react";
import { Link } from "gatsby";
import * as PropTypes from "prop-types";
import Note from "../components/Note";
import { useWindowSize } from "../hooks/use-window-size";
import {
  useStackedPagesProvider,
  LinkToStacked,
} from "react-stacked-pages-hook";

import "./layout.css";

function noteContainerClassName(overlay, obstructed) {
  return `note-container ${overlay ? "note-container-overlay" : ""} ${
    obstructed ? "note-container-obstructed" : ""
  }`;
}

const NoteWrapper = ({
  PageIndexProvider,
  children,
  slug,
  title,
  i,
  overlay,
  obstructed,
}) => (
  <PageIndexProvider value={i}>
    <div
      className={noteContainerClassName(overlay, obstructed)}
      style={{ left: 40 * (i || 0), right: -585 }}
    >
      <div className="note-content">{children}</div>
      <LinkToStacked to={slug} className="obstructed-label">
        {title}
      </LinkToStacked>
    </div>
  </PageIndexProvider>
);

const NotesLayout = ({ children, location, slug, title }) => {
  const windowSize = useWindowSize();
  const processPageQuery = useCallback(
    (x) =>
      x.json.data.roamPage
        ? {
            title: x.json.data.roamPage.title,
            mdx: x.json.data.roamPage.fields.allMarkdown.childMdx.body,
            outboundReferences:
              x.json.data.roamPage.fields.allOutboundReferences,
            inboundReferences: x.json.data.roamPage.fields.inboundReferences,
          }
        : x.json.data.roamBlock
        ? {
            title: x.json.data.roamBlock.fields.parentPage.title,
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
    stackedPageStates,
    navigateToStackedPage,
    ContextProvider,
    PageIndexProvider,
    scrollContainer,
  ] = useStackedPagesProvider({
    firstPageSlug: slug,
    location,
    processPageQuery,
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
                <NoteWrapper
                  PageIndexProvider={PageIndexProvider}
                  i={0}
                  slug={slug}
                  title={title}
                  overlay={
                    stackedPageStates[slug] && stackedPageStates[slug].overlay
                  }
                  obstructed={
                    stackedPageStates[slug] &&
                    stackedPageStates[slug].obstructed
                  }
                >
                  {children}
                </NoteWrapper>
                {stackedPages.map((page, i) => (
                  <NoteWrapper
                    key={page.slug}
                    PageIndexProvider={PageIndexProvider}
                    i={i + 1}
                    slug={page.slug}
                    title={page.data.title}
                    overlay={
                      stackedPageStates[page.slug] &&
                      stackedPageStates[page.slug].overlay
                    }
                    obstructed={
                      stackedPageStates[page.slug] &&
                      stackedPageStates[page.slug].obstructed
                    }
                  >
                    <Note {...page.data} />
                  </NoteWrapper>
                ))}
              </React.Fragment>
            ) : !stackedPages.length ? (
              <NoteWrapper
                PageIndexProvider={PageIndexProvider}
                i={0}
                slug={slug}
                title={title}
              >
                {children}
              </NoteWrapper>
            ) : (
              <NoteWrapper
                PageIndexProvider={PageIndexProvider}
                i={stackedPages.length - 1}
                slug={stackedPages[stackedPages.length - 1].slug}
                title={stackedPages[stackedPages.length - 1].data.title}
              >
                <Note {...stackedPages[stackedPages.length - 1].data} />
              </NoteWrapper>
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

export default NotesLayout;
