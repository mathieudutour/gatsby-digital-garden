import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "gatsby";
import * as PropTypes from "prop-types";
import qs from "querystring";
import Note from "../components/Note";
import { useWindowSize } from "../hooks/use-window-size";

import "./layout.css";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const NoteWrapper = ({ note, i }) => (
  <div className="note-container" style={{ left: 40 * (i + 1), right: -585 }}>
    {note.json.data.roamBlock ? (
      <Note
        index={i + 1}
        partOf={{
          slug: note.json.data.roamBlock.fields.parentPage.fields.slug,
          title: note.json.data.roamBlock.fields.parentPage.title,
        }}
        mdx={note.json.data.roamBlock.fields.allMarkdown.childMdx.body}
        outboundReferences={
          note.json.data.roamBlock.fields.allOutboundReferences
        }
        inboundReferences={note.json.data.roamBlock.fields.inboundReferences}
      />
    ) : (
      <Note
        index={i + 1}
        mdx={note.json.data.roamPage.fields.allMarkdown.childMdx.body}
        outboundReferences={
          note.json.data.roamPage.fields.allOutboundReferences
        }
        inboundReferences={note.json.data.roamPage.fields.inboundReferences}
      />
    )}
  </div>
);

const NotesLayout = ({ children, location }) => {
  const windowSize = useWindowSize();
  const [stackedNotes, setStackedNotes] = useState([]);
  const scrollContainer = useRef();

  const stackedNotesSlugs = useMemo(() => {
    const res = qs.parse(location.search.replace(/^\?/, "")).stackedNotes || [];
    if (typeof res === "string") {
      return [res];
    }
    return res;
  }, [location]);

  useEffect(() => {
    Promise.all(
      // hook into the internals of Gatsby to dynamically fetch the notes
      stackedNotesSlugs.map((slug) => window.___loader.loadPage(slug))
    ).then((data) =>
      setStackedNotes(
        // filter out 404s
        data.filter((x) => x.json.data.roamPage || x.json.data.roamBlock)
      )
    );
  }, [stackedNotesSlugs]);

  useEffect(() => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({
        top: 0,
        left: 625 * (stackedNotes.length + 1),
        behavior: "smooth",
      });
    }
  }, [stackedNotes]);

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
          {windowSize.width > 800 ? (
            <React.Fragment>
              <div className="note-container" style={{ left: 0, right: -585 }}>
                {children}
              </div>
              {stackedNotes.map((note, i) => (
                <NoteWrapper note={note} i={i} key={note.page.path} />
              ))}
            </React.Fragment>
          ) : !stackedNotes.length ? (
            <div className="note-container" style={{ left: 0, right: -585 }}>
              {children}
            </div>
          ) : (
            <NoteWrapper
              note={stackedNotes[stackedNotes.length - 1]}
              i={stackedNotes.length - 1}
            />
          )}
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
