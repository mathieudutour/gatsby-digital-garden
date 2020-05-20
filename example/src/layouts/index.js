import React, { useEffect, useRef, useCallback } from "react";
import { Link } from "gatsby";
import * as PropTypes from "prop-types";
import Note from "../components/Note";
import { useWindowSize } from "../hooks/use-window-size";
import { useStackedNotesProvider } from "../hooks/use-stacked-notes";

import "./layout.css";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const NoteWrapper = ({ note, i }) => (
  <div className="note-container" style={{ left: 40 * (i + 1), right: -585 }}>
    <Note index={i + 1} {...note} />
  </div>
);

const NotesLayout = ({ children, location }) => {
  const windowSize = useWindowSize();
  const scrollContainer = useRef();
  const pageToNote = useCallback(
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
    stackedNotes,
    navigateToNote,
    ContextProvider,
  ] = useStackedNotesProvider({
    indexNote: "/About-these-notes",
    location,
    pageToNote,
    containerRef: scrollContainer,
    noteWidth: 625,
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
          style={{ width: 625 * (stackedNotes.length + 1) }}
        >
          <ContextProvider value={{ stackedNotes, navigateToNote }}>
            {windowSize.width > 800 ? (
              <React.Fragment>
                <div
                  className="note-container"
                  style={{ left: 0, right: -585 }}
                >
                  {children}
                </div>
                {stackedNotes.map((note, i) => (
                  <NoteWrapper note={note.data} i={i} key={note.slug} />
                ))}
              </React.Fragment>
            ) : !stackedNotes.length ? (
              <div className="note-container" style={{ left: 0, right: -585 }}>
                {children}
              </div>
            ) : (
              <NoteWrapper
                note={stackedNotes[stackedNotes.length - 1].data}
                i={stackedNotes.length - 1}
              />
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
