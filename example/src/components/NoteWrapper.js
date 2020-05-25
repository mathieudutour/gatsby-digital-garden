import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";

import "./NoteWrapper.css";

function noteContainerClassName(overlay, obstructed, highlighted) {
  return `note-container ${overlay ? "note-container-overlay" : ""} ${
    obstructed ? "note-container-obstructed" : ""
  } ${highlighted ? "note-container-highlighted" : ""}`;
}

export const NoteWrapper = ({
  PageIndexProvider,
  children,
  slug,
  title,
  i,
  overlay,
  obstructed,
  highlighted,
}) => (
  <PageIndexProvider value={i}>
    <div
      className={noteContainerClassName(overlay, obstructed, highlighted)}
      style={{ left: 40 * (i || 0), right: -585 }}
    >
      <div className="note-content">{children}</div>
      <LinkToStacked to={slug} className="obstructed-label">
        {title}
      </LinkToStacked>
    </div>
  </PageIndexProvider>
);
