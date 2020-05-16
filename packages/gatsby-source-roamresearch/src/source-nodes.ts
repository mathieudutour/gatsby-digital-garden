import { SourceNodesArgs, Node } from "gatsby";
import downloadRoam, { RoamBlock, RoamPage } from "fetch-roamresearch";
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

  const pages = await downloadRoam(
    url,
    {
      email,
      password,
    },
    { reporter, puppeteer: { headless } }
  );

  if (!pages) {
    reporter.error("Could not download the Roam Research data");
    return;
  }

  const dbContent = JSON.stringify(pages);
  const dbMeta = {
    id: createNodeId(`roam-db-${url}`),
    parent: undefined,
    children: [],
    internal: {
      type: `RoamDatabase`,
      mediaType: `application/json`,
      content: dbContent,
      contentDigest: createContentDigest(pages),
    },
  };
  createNode(dbMeta);

  const makeMarkdownNode = (data: RoamPage | RoamBlock, node: Node) => {
    const {
      allString,
      string,
      outboundReferences,
      allOutboundReferences,
    } = makeMarkdown(data);

    const textNode = {
      id: `${node.id}-Markdown`,
      parent: node.id,
      internal: {
        type: `RoamMarkdownRepresentation`,
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

    const allTextNode = {
      id: `${node.id}-AllMarkdown`,
      parent: node.id,
      internal: {
        type: `RoamMarkdownRepresentation`,
        mediaType: "text/markdown",
        content: allString,
        contentDigest: createContentDigest(allString),
      },
    };
    createNode(allTextNode);

    createNodeField({
      node,
      name: "allMarkdown___NODE",
      value: allTextNode.id,
    });

    return { outboundReferences, allOutboundReferences };
  };

  const nodes: {
    node: Node;
    outboundReferences: { blocks: string[]; pages: string[] };
    allOutboundReferences: { blocks: string[]; pages: string[] };
  }[] = [];

  const makeBlockNode = (block: RoamBlock, parent: Node, page: Node) => {
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
    const nodeData = Object.assign({}, block, nodeMeta);
    createNode(nodeData);
    let node = getNode(nodeData.id);

    createNodeField({
      node,
      name: "parentPage___NODE",
      value: page.id,
    });

    block.children?.forEach((grandChild) =>
      makeBlockNode(grandChild, node, page)
    );

    node = getNode(nodeData.id);
    const { outboundReferences, allOutboundReferences } = makeMarkdownNode(
      block,
      node
    );

    nodes.push({ node, outboundReferences, allOutboundReferences });
  };

  pages.forEach((page) => {
    const nodeContent = JSON.stringify(page);
    const nodeMeta = {
      id: createNodeId(`roam-page-${page.title}`),
      parent: dbMeta.id,
      children: [],
      internal: {
        type: `RoamPage`,
        mediaType: `application/json`,
        content: nodeContent,
        contentDigest: createContentDigest(page),
      },
    };
    const nodeData = Object.assign({}, page, nodeMeta);
    createNode(nodeData);
    let node = getNode(nodeData.id);
    page.children?.forEach((child) => makeBlockNode(child, node, node));

    node = getNode(nodeData.id);
    const { outboundReferences, allOutboundReferences } = makeMarkdownNode(
      page,
      node
    );

    nodes.push({ node, outboundReferences, allOutboundReferences });
  });

  const inboundReferences: { [id: string]: string[] } = {};

  function refsToId(refs: { blocks: string[]; pages: string[] }) {
    return refs.pages
      .map((ref) => createNodeId(`roam-page-${ref}`))
      .concat(refs.blocks.map((ref) => createNodeId(`roam-block-${ref}`)))
      .map((id) => getNode(id))
      .filter((x) => !!x)
      .map((x) => x.id as string);
  }

  nodes
    .map(({ node, outboundReferences, allOutboundReferences }) => {
      const mapped = refsToId(outboundReferences);

      mapped.forEach((x) => {
        if (!inboundReferences[x]) {
          inboundReferences[x] = [];
        }
        inboundReferences[x].push(node.id);
      });

      return {
        node,
        outboundReferences: mapped,
        allOutboundReferences: refsToId(allOutboundReferences),
      };
    })
    .forEach(({ node, outboundReferences, allOutboundReferences }) => {
      let refreshedNode = getNode(node.id);
      createNodeField({
        node: refreshedNode,
        name: "outboundReferences___NODE",
        value: outboundReferences,
      });

      refreshedNode = getNode(node.id);
      createNodeField({
        node: refreshedNode,
        name: "allOutboundReferences___NODE",
        value: allOutboundReferences,
      });

      refreshedNode = getNode(node.id);
      createNodeField({
        node: refreshedNode,
        name: "inboundReferences___NODE",
        value: inboundReferences[node.id] || [],
      });
    });
};
