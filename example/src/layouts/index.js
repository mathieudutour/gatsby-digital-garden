import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { useWindowWidth } from "@react-hook/window-size";
import { useStackedPagesProvider } from "react-stacked-pages-hook";
import { dataToNote } from "./data-to-note";
import Note from "../components/Note";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { NoteWrapper } from "../components/NoteWrapper";

import "./layout.css";

const NotesLayout = ({ location, slug, data }) => {
  const gatsbyData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const windowWidth = useWindowWidth();

  const [
    stackedPages,
    stackedPageStates,
    ContextProvider,
    PageIndexProvider,
    scrollContainer,
  ] = useStackedPagesProvider({
    firstPage: { slug, data },
    location,
    processPageQuery: dataToNote,
    pageWidth: 625,
  });

  return (
    <div className="layout">
      <header>
        <Link to="/">
          <h3>{gatsbyData.site.siteMetadata.title}</h3>
        </Link>
        <DarkModeToggle />
      </header>

      <div className="note-columns-scrolling-container" ref={scrollContainer}>
        <div
          className="note-columns-container"
          style={{ width: 625 * (stackedPages.length + 1) }}
        >
          <ContextProvider>
            {windowWidth > 800 ? (
              <React.Fragment>
                {stackedPages.map((page, i) => (
                  <NoteWrapper
                    key={page.slug}
                    PageIndexProvider={PageIndexProvider}
                    i={i}
                    slug={page.slug}
                    title={page.data.title}
                    {...stackedPageStates[page.slug]}
                  >
                    <Note {...page.data} />
                  </NoteWrapper>
                ))}
              </React.Fragment>
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
    </div>
  );
};

export default NotesLayout;
