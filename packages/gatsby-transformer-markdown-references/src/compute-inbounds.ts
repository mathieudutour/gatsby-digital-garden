import { basename, extname } from "path";
import { Node } from "gatsby";
import { nonNullable } from "./non-nullable";
import {
  getAllCachedNodes,
  setCachedNode,
  setInboundReferences,
} from "./cache";

function hasChildInArrayExcept(
  node: Node,
  array: Node[],
  except: string,
  getNode: (id: string) => Node | undefined
): boolean {
  return node.children.some((id) => {
    if (id === except) {
      return false;
    }

    if (array.some((x) => x.id === id)) {
      return true;
    }

    const child = getNode(id);
    if (!child || !child.children || !child.children.length) {
      return false;
    }

    return hasChildInArrayExcept(child, array, except, getNode);
  });
}

let currentGeneration: Promise<boolean> | undefined;

export async function generateData(cache: any, getNode: Function) {
  if (currentGeneration) {
    return currentGeneration;
  }

  currentGeneration = Promise.resolve().then(async () => {
    const nodes = await getAllCachedNodes(cache, getNode);
    const inboundReferences: { [id: string]: Node[] } = {};

    function getRef(title: string) {
      return nodes.find(
        (x) =>
          x.title === title ||
          x.aliases.some((alias) => alias === title) ||
          (typeof x.node.fileAbsolutePath === "string" &&
            basename(
              x.node.fileAbsolutePath,
              extname(x.node.fileAbsolutePath)
            ) === title) ||
          (typeof x.node.absolutePath === "string" &&
            basename(x.node.absolutePath, extname(x.node.absolutePath)) ===
              title)
      );
    }

    await Promise.all(
      nodes
        .map((node) => {
          const mapped = node.outboundReferences.pages
            .map(getRef)
            .concat(node.outboundReferences.blocks.map(getRef))
            .filter(nonNullable)
            .map((x) => x.node.id);

          mapped.forEach((x) => {
            if (!inboundReferences[x]) {
              inboundReferences[x] = [];
            }
            inboundReferences[x].push(node.node);
          });

          return {
            ...node,
            resolvedOutboundReferences: mapped,
          };
        })
        .map((data) => setCachedNode(cache, data.node.id, data))
    );

    Object.keys(inboundReferences).forEach((nodeId) => {
      inboundReferences[nodeId] = inboundReferences[nodeId].filter(
        (node) =>
          getNode(node.parent) &&
          !hasChildInArrayExcept(
            getNode(node.parent),
            inboundReferences[nodeId],
            node.id,
            // @ts-ignore
            getNode
          )
      );
    });

    const inboundReferencesId = Object.keys(inboundReferences).reduce(
      (prev, x) => {
        prev[x] = inboundReferences[x].map((y) => y.id);
        return prev;
      },
      {} as { [id: string]: string[] }
    );

    await setInboundReferences(cache, inboundReferencesId);

    currentGeneration = undefined;

    return true;
  });

  return currentGeneration;
}
