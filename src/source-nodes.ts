import { SourceNodesArgs, Node } from "gatsby";
import { downloadRoam } from "./download-roam";
import { RoamBlock, RoamPage } from "./roam-schema";
import { makeMarkdown } from "./make-markdown";

export const sourceNodes = async (
  {
    actions,
    createNodeId,
    createContentDigest,
    reporter,
    getNode,
  }: SourceNodesArgs,
  options: { url: string; email: string; password: string; headless?: boolean }
) => {
  const { url, email, password, headless } = options;
  const { createNode, createNodeField } = actions;

  const data = await downloadRoam(url, { email, password, reporter, headless });

  if (!data) {
    reporter.error("Could not download the Roam Research data");
    return;
  }

  const makeMarkdownNode = (page: RoamPage, node: Node) => {
    const { string, outboundReferences } = makeMarkdown(page);
    const textNode = {
      id: `${node.id}-Markdown`,
      parent: node.id,
      internal: {
        type: `${node.internal.type}MarkdownBody`,
        mediaType: "text/markdown",
        content: string,
        contentDigest: createContentDigest(string),
      },
    };
    createNode(textNode);

    createNodeField({
      node,
      name: "markdown___NODE",
      value: textNode.id,
    });

    return outboundReferences;
  };

  const makeBlockNode = (block: RoamBlock, parent: Node) => {
    const nodeContent = JSON.stringify(block);
    const nodeMeta = {
      id: createNodeId(`roam-block-${block.uid || Math.random()}`),
      parent: parent.id,
      children: [],
      internal: {
        type: `RoamBlock`,
        mediaType: `application/json`,
        content: nodeContent,
        contentDigest: createContentDigest(block),
      },
    };
    const node = Object.assign({}, block, nodeMeta);
    createNode(node);
    const child = getNode(node.id);
    block.children?.forEach((grandCchild) => makeBlockNode(grandCchild, child));
  };

  const nodes = data.map((page) => {
    const nodeContent = JSON.stringify(page);
    const nodeMeta = {
      id: createNodeId(`roam-page-${page.title}`),
      parent: undefined,
      children: [],
      internal: {
        type: `RoamPage`,
        mediaType: `application/json`,
        content: nodeContent,
        contentDigest: createContentDigest(page),
      },
    };
    const node = Object.assign({}, page, nodeMeta);
    createNode(node);
    const parent = getNode(node.id);
    page.children?.forEach((child) => makeBlockNode(child, parent));

    const outboundReferences = makeMarkdownNode(page, parent);

    return { node: parent, outboundReferences };
  });

  const inboundReferences: { [id: string]: string[] } = {};

  nodes
    .map(({ node, outboundReferences }) => {
      const mapped = outboundReferences
        .map((ref) => createNodeId(`roam-page-${ref}`))
        .map((id) => getNode(id))
        .filter((x) => !!x)
        .map((x) => x.id);

      mapped.forEach((x) => {
        if (!inboundReferences[x]) {
          inboundReferences[x] = [];
        }
        inboundReferences[x].push(node.id);
      });

      return { node, outboundReferences: mapped };
    })
    .forEach(({ node, outboundReferences }) => {
      createNodeField({
        node,
        name: "outboundReferences___NODE",
        value: outboundReferences,
      });

      createNodeField({
        node,
        name: "inboundReferences___NODE",
        value: inboundReferences[node.id] || [],
      });
    });
};
