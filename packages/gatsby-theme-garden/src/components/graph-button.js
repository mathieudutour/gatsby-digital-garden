import React, { useState, lazy, Suspense } from "react";

import "./graph-button.css";

const Graph = lazy(() => import("./graph-visualisation"));

const GraphButton = () => {
  const [graphState, setGraphState] = useState("hidden");

  return (
    <React.Fragment>
      <button
        title="Show Graph visualisation"
        aria-label="Show Graph visualisation"
        className="graph-button"
        onClick={() => setGraphState("maximized")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="20"
          height="20"
        >
          <g fill="none" strokeWidth="2">
            <circle cx="11.733" cy="3.181" r="1.902" />
            <circle cx="16.864" cy="10.861" r="1.902" />
            <circle cx="7.47" cy="16.822" r="1.902" />
            <circle cx="3.046" cy="6.275" r="1.902" />
            <circle cx="9.372" cy="10.861" r="1.902" />
            <line x1="11.635" x2="14.655" y1="10.861" y2="10.861" />
            <line x1="10" x2="10.895" y1="8.959" y2="5.573" />
            <line x1="7.47" x2="4.5" y1="9.68" y2="7.5" />
            <line x1="8.25" x2="8.809" y1="14.92" y2="13.088" />
          </g>
        </svg>
      </button>
      {typeof window !== "undefined" ? (
        <Suspense fallback={null}>
          <Graph graphState={graphState} setGraphState={setGraphState} />
        </Suspense>
      ) : null}
    </React.Fragment>
  );
};

export default GraphButton;
