import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { animated, useSpring } from "react-spring";
import * as d3 from "d3";
import { useGraphData } from "../use-graph-data";
import { useWindowSize } from "../use-window-size";

import "./graph-visualisation.css";

const RADIUS = 4;
const STROKE = 1;
const FONT_SIZE = 14;
const TICKS = 5000;
const FONT_BASELINE = 15;
const MINIMIZED_GRAPH = {
  width: 200,
  height: 177,
};

const GraphVisualisation = ({ setGraphState, graphState }) => {
  const [nodesData, linksData, navigate, highlight] = useGraphData();
  const windowSize = useWindowSize();
  const d3Container = useRef(null);
  const [zoom, setZoom] = useState(1);

  const modalSize = {
    width: Math.min(windowSize.width - 40, 900),
    height: Math.min(windowSize.height - 40, 800),
  };

  const simulation = useRef(
    d3
      .forceSimulation(nodesData)
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "link",
        d3
          .forceLink(linksData)
          .id((d) => d.id)
          .distance(40)
      )
      .force(
        "center",
        d3.forceCenter(modalSize.width / 2, modalSize.height / 2)
      )
      .stop()
  );

  useEffect(() => {
    if (!d3Container.current || graphState === "hidden") {
      return;
    }

    const g = d3.select("#d3-container").select("g");
    let link = g.select(".links").selectAll(".link");
    let node = g.select(".nodes").selectAll(".node");
    let text = g.select(".text").selectAll(".text");

    const zoomOrKeep = (value) => (zoom >= 1 ? value / zoom : value);

    const font = Math.max(Math.round(zoomOrKeep(FONT_SIZE)), 1);

    text.attr("font-size", `${font}px`);
    link.attr("stroke-width", zoomOrKeep(STROKE));
    node.attr("r", zoomOrKeep(RADIUS));
  }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const hookNode = useCallback(
    (node) => {
      return node
        .on("click", (d) => {
          navigate(d.slug);
          setGraphState("minimized");
        })
        .on("mouseenter", (d) => {
          highlight(d.slug, true);
        })
        .on("mouseleave", (d) => {
          highlight(d.slug, false);
        });
    },
    [navigate, highlight, setGraphState]
  );

  const zoomHandler = useRef(null);

  useEffect(() => {
    if (!d3Container.current || graphState === "hidden") {
      return;
    }

    const svg = d3.select("#d3-container");
    const g = svg.select("g");

    const zoomActions = () => {
      const scale = d3.event.transform;
      setZoom(scale.k);
      g.attr("transform", scale);
    };

    zoomHandler.current = d3
      .zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", zoomActions);

    zoomHandler.current(svg);

    const zoomOrKeep = (value) => (zoom >= 1 ? value / zoom : value);
    const font = Math.max(Math.round(zoomOrKeep(FONT_SIZE)), 1);

    let link = g.select(".links").selectAll(".link");
    let node = g.select(".nodes").selectAll(".node");
    let text = g.select(".text").selectAll(".text");

    node = node.data(nodesData, (d) => d.id);
    node.exit().remove();
    node = hookNode(
      node
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", zoomOrKeep(RADIUS))
    ).merge(node);

    link = link.data(linksData, (d) => `${d.source.id}-${d.target.id}`);
    link.exit().remove();
    link = link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", zoomOrKeep(STROKE))
      .attr("stroke", "grey")
      .merge(link);

    text = text.data(nodesData, (d) => d.label);
    text.exit().remove();
    text = hookNode(
      text
        .enter()
        .append("text")
        .text((d) => d.label.replace(/_*/g, ""))
        .attr("class", "text")
        .attr("font-size", `${font}px`)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
    ).merge(text);

    simulation.current.nodes(nodesData);
    simulation.current.force("link").links(linksData);
    simulation.current.alpha(1).restart();
    simulation.current.stop();

    for (let i = 0; i < TICKS; i++) {
      simulation.current.tick();
    }

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    text.attr("x", (d) => d.x).attr("y", (d) => d.y - FONT_BASELINE);
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }, [graphState, d3Container]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!d3Container.current || graphState === "hidden") {
      return;
    }

    const svg = d3.select("#d3-container");
    const g = svg.select("g");
    const node = g
      .select(".nodes")
      .selectAll(".node")
      .data(nodesData, (d) => d.id);
    const text = g
      .select(".text")
      .selectAll(".text")
      .data(nodesData, (d) => d.id);
    g.select(".links")
      .selectAll(".link")
      .data(linksData, (d) => `${d.source.id}-${d.target.id}`);

    node.attr("fill", (d) => d.color);
    text.attr("fill", (d) => d.color);
  }, [nodesData, linksData, graphState, d3Container]);

  const [modalSpring, setModalSpring] = useSpring(() => ({
    to: {
      bottom: "0%",
      right: "0%",
      height: MINIMIZED_GRAPH.height,
      width: MINIMIZED_GRAPH.width,
      transform: "translate(0%, 100%)",
    },
    onFrame(value) {
      if (!zoomHandler.current) {
        return;
      }

      const ratio = Math.max(
        value.height / modalSize.height,
        value.width / modalSize.width
      );
      const svg = d3.select("#d3-container");
      zoomHandler.current.scaleTo(svg, ratio);

      zoomHandler.current.translateTo(
        svg,
        modalSize.width / 2,
        modalSize.height / 2
      );
    },
  }));

  useEffect(() => {
    setModalSpring(
      graphState === "maximized"
        ? {
            bottom: "50%",
            right: "50%",
            height: modalSize.height,
            width: modalSize.width,
            transform: "translate(50%, 50%)",
          }
        : graphState === "minimized"
        ? {
            bottom: "0%",
            right: "0%",
            height: MINIMIZED_GRAPH.height,
            width: MINIMIZED_GRAPH.width,
            transform: "translate(0%, 0%)",
          }
        : {
            bottom: "0%",
            right: "0%",
            height: MINIMIZED_GRAPH.height,
            width: MINIMIZED_GRAPH.width,
            transform: "translate(0%, 100%)",
          }
    );
  }, [graphState, setModalSpring]); // eslint-disable-line react-hooks/exhaustive-deps

  const overlaySpring = useSpring(
    graphState === "maximized"
      ? { opacity: 1, blur: 4 }
      : { opacity: 0, blur: 0 }
  );

  return createPortal(
    <div>
      <animated.div
        style={{
          pointerEvents: graphState === "maximized" ? "all" : "none",
          opacity: overlaySpring.opacity,
          backdropFilter: `blur(${overlaySpring.blur})`,
        }}
        aria-hidden
        className="overlay"
        onClick={(ev) => {
          if (!ev.isDefaultPrevented()) {
            setGraphState("hidden");
          }
        }}
      />

      <animated.div
        style={modalSpring}
        className={`modal modal-${graphState}`}
        onClick={(ev) => ev.preventDefault()}
      >
        <button
          className="modal-scale"
          type="button"
          onClick={() => {
            setGraphState(
              graphState === "maximized" ? "minimized" : "maximized"
            );
          }}
          aria-label={
            graphState === "maximized" ? "Minimise Graph" : "Maximise Graph"
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path
              d={
                graphState === "maximized"
                  ? "M1.7 63.9h29.2c.9 0 1.592-1.568 1.592-2.468 0-.9-.692-2.342-1.592-2.342H4.46V4.607h54.9V30.8c0 .9 1.34 1.547 2.24 1.547.9 0 2.3-.647 2.3-1.547V1.7c0-.9-.7-1.6-1.6-1.6H1.6C.7.1 0 .8 0 1.7v60.7c.1.8.8 1.5 1.7 1.5zm62.2-23.8c0-.9-.7-1.6-1.6-1.6H40c-.9 0-1.6.7-1.6 1.6v22.3c0 .9.7 1.6 1.6 1.6h22.3c.9 0 1.6-.7 1.6-1.6V40.1zm-4.669 19.345H43.07v-16.39h16.16v16.39zM33.23 17.735c.9 0 2.071.765 2.071 1.665v14.3c0 .9-.7 1.6-1.6 1.6H19.4c-.9 0-1.836-1.41-1.836-2.31 0-.9.936-1.78 1.836-1.78h8.58L11.19 14.134c-.6-.6-.07-1.776.53-2.476.6-.6 1.944-1.053 2.644-.453l16.64 16.612V19.4c0-.9 1.325-1.664 2.225-1.664z"
                  : "M1.7 63.9h29.2c.9 0 1.592-1.568 1.592-2.468 0-.9-.692-2.342-1.592-2.342H4.46V4.607h54.9V30.8c0 .9 1.34 1.547 2.24 1.547.9 0 2.3-.647 2.3-1.547V1.7c0-.9-.7-1.6-1.6-1.6H1.6C.7.1 0 .8 0 1.7v60.7c.1.8.8 1.5 1.7 1.5zm62.2-23.8c0-.9-.7-1.6-1.6-1.6H40c-.9 0-1.6.7-1.6 1.6v22.3c0 .9.7 1.6 1.6 1.6h22.3c.9 0 1.6-.7 1.6-1.6V40.1zm-4.669 19.345H43.07v-16.39h16.16v16.39zM12.997 28.487c-.9 0-2.071-.764-2.071-1.664v-14.3c0-.9.7-1.6 1.6-1.6h14.3c.9 0 1.836 1.409 1.836 2.309 0 .9-.936 1.78-1.836 1.78h-8.58l16.79 17.077c.6.6.07 1.776-.53 2.476-.6.6-1.944 1.052-2.644.452l-16.64-16.611v8.417c0 .9-1.325 1.664-2.225 1.664z"
              }
            />
          </svg>
        </button>
        <button
          className="modal-close"
          type="button"
          onClick={() => {
            setGraphState("hiddeen");
          }}
          aria-label="Close Graph"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M11.997 9.90045L20.9 1L23 3.09955L14.097 12L23 20.9005L20.9 23L11.997 14.0995L3.10001 22.994L1 20.8944L9.89699 12L1 3.10558L3.10001 1.00603L11.997 9.90045Z" />
          </svg>
        </button>
        {graphState === "hidden" ? null : (
          <svg className="modal-body" ref={d3Container} id="d3-container">
            <g>
              <g className="links"></g>
              <g className="nodes"></g>
              <g className="text"></g>
            </g>
          </svg>
        )}
      </animated.div>
    </div>,
    document.body
  );
};

export default GraphVisualisation;
