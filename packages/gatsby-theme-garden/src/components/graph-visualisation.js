import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useGraphData } from "../use-graph-data";
import * as d3 from "d3";
import { useStackedPages } from "react-stacked-pages-hook";
import { useWindowSize } from "../use-window-size";
import { generateGradientColors } from "../utils/gradient";

import "./graph-visualisation.css";

const RADIUS = 4;
const STROKE = 1;
const FONT_SIZE = 14;
const TICKS = 5000;
const FONT_BASELINE = 15;

const GraphVisualisation = ({ setGraphState, graphState }) => {
  const [stackedPages, , navigate, highlight] = useStackedPages();
  const windowSize = useWindowSize();
  const d3Container = useRef(null);
  const [zoom, setZoom] = useState(1);
  const data = useGraphData();

  const hookNode = useCallback(
    (node) => {
      return node
        .attr("fill", (d) => d.color)
        .on("click", (d) => {
          navigate(d.slug);
          setGraphState("hidden");
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

  const [nodesData, linksData] = useMemo(() => {
    const nodesData = [];
    const linksData = [];

    const textColor =
      typeof document !== "undefined"
        ? getComputedStyle(document.body).getPropertyValue("--text").trim()
        : "#1a202c";
    const linkColor =
      typeof document !== "undefined"
        ? getComputedStyle(document.body).getPropertyValue("--link").trim()
        : "#3182ce";

    const colors = generateGradientColors(
      linkColor,
      textColor,
      stackedPages.length + 1
    );

    if (data.allFile && data.allFile.nodes && data.allFile.nodes.length) {
      data.allFile.nodes.forEach((node) => {
        const nodeIndex = stackedPages.findIndex(
          (x) => x.slug === node.fields.slug
        );
        nodesData.push({
          id: node.id,
          label: node.fields.title,
          slug: node.fields.slug,
          color: nodeIndex !== -1 ? colors[nodeIndex + 1] : textColor,
        });

        node.childMdx.outboundReferences.forEach((x) =>
          linksData.push({ source: node.id, target: x.parent.id })
        );
      });
    }
    if (
      data.allRoamPage &&
      data.allRoamPage.nodes &&
      data.allRoamPage.nodes.length
    ) {
      data.allRoamPage.nodes.forEach((node) => {
        const nodeIndex = stackedPages.findIndex(
          (x) => x.slug === node.fields.slug
        );
        nodesData.push({
          id: node.id,
          label: node.title,
          slug: node.fields.slug,
          color: nodeIndex !== -1 ? colors[nodeIndex + 1] : textColor,
        });

        node.childMdx.outboundReferences.forEach((x) =>
          linksData.push({ source: node.id, target: x.parent.id })
        );
      });
    }

    return [nodesData, linksData];
  }, [data, stackedPages]);

  const simulation = useRef(
    d3
      .forceSimulation(nodesData)
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "link",
        d3
          .forceLink(linksData)
          .id((d) => d.id)
          .distance(70)
      )
      .force(
        "center",
        d3.forceCenter(
          Math.min(windowSize.width - 40, 900) / 2,
          Math.min(windowSize.height - 40, 800) / 2
        )
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
    text.attr("y", (d) => d.y - zoomOrKeep(FONT_BASELINE));
    link.attr("stroke-width", zoomOrKeep(STROKE));
    node.attr("r", zoomOrKeep(RADIUS));
  }, [zoom]);

  useEffect(() => {
    if (!d3Container.current || graphState === "hidden") {
      return;
    }

    const svg = d3.select("#d3-container");
    const g = svg.select("g");
    let node = g.select(".nodes").selectAll(".node");
    let text = g.select(".text").selectAll(".text");

    const zoomActions = () => {
      const scale = d3.event.transform;
      setZoom(scale.k);
      g.attr("transform", scale);
    };

    const zoomHandler = d3.zoom().scaleExtent([0.2, 3]).on("zoom", zoomActions);

    zoomHandler(svg);
  }, [graphState, d3Container.current]);

  useEffect(() => {
    if (!d3Container.current || graphState === "hidden") {
      return;
    }

    const svg = d3.select("#d3-container");
    const g = svg.select("g");
    let link = g.select(".links").selectAll(".link");
    let node = g.select(".nodes").selectAll(".node");
    let text = g.select(".text").selectAll(".text");

    node = node.data(nodesData, (d) => d.id);
    node.exit().remove();
    node = hookNode(
      node.enter().append("circle").attr("class", "node").attr("r", RADIUS)
    ).merge(node);

    link = link.data(linksData, (d) => `${d.source.id}-${d.target.id}`);
    link.exit().remove();
    link = link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", STROKE)
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
        .attr("font-size", `${FONT_SIZE}px`)
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
    text.attr("x", (d) => d.x).attr("y", (d) => d.y - FONT_BASELINE / zoom);
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }, [nodesData, linksData, graphState, d3Container.current]);

  if (graphState === "hidden") {
    return null;
  }

  return createPortal(
    <div>
      {graphState === "minimized" ? null : (
        <div
          className="overlay"
          onClick={(ev) => {
            if (!ev.isDefaultPrevented()) {
              setGraphState("hidden");
            }
          }}
        />
      )}
      <div
        className={`modal modal-${graphState}`}
        onClick={(ev) => ev.preventDefault()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={() => setGraphState("hidden")}
          aria-label="Close Graph"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M11.997 9.90045L20.9 1L23 3.09955L14.097 12L23 20.9005L20.9 23L11.997 14.0995L3.10001 22.994L1 20.8944L9.89699 12L1 3.10558L3.10001 1.00603L11.997 9.90045Z" />
          </svg>
        </button>
        <svg className="modal-body" ref={d3Container} id="d3-container">
          <g>
            <g className="links"></g>
            <g className="nodes"></g>
            <g className="text"></g>
          </g>
        </svg>
      </div>
    </div>,
    document.body
  );
};

export default GraphVisualisation;
