import { useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useStackedPages } from "react-stacked-pages-hook";
import { generateGradientColors } from "./utils/gradient";

export const useGraphData = () => {
  const [stackedPages, , navigate, highlight] = useStackedPages();
  const data = useStaticQuery(graphql`
    {
      allFile {
        nodes {
          id
          fields {
            title
            slug
          }
          childMdx {
            outboundReferences {
              ... on Mdx {
                parent {
                  id
                }
              }
            }
          }
        }
      }
    }
  `);

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

    data.allFile.nodes.forEach((node) => {
      if (!node.fields || !node.fields.slug) {
        return
      }

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

    return [nodesData, linksData];
  }, [data, stackedPages]);

  return [nodesData, linksData, navigate, highlight];
};
