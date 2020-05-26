import { SourceNodesArgs, Node } from "gatsby";
import downloadRoam, { RoamBlock } from "fetch-roamresearch";
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
  const { createNode, createNodeField, createParentChildLink } = actions;

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
    sourceUrl: url,
    children: [],
    internal: {
      type: `RoamDatabase`,
      mediaType: `application/json`,
      content: dbContent,
      contentDigest: createContentDigest(pages),
    },
  };
  createNode(dbMeta);
  const dbNode = getNode(dbMeta.id);

  const makeBlockNode = (block: RoamBlock, parent: Node, page: Node) => {
    const content = makeMarkdown(block);

    const nodeMeta = {
      id: createNodeId(`roam-block-${block.uid || Math.random()}`),
      parent: parent.id,
      sourceUrl: url,
      children: [],
      internal: {
        type: `RoamBlock`,
        mediaType: `text/markdown`,
        content,
        contentDigest: createContentDigest(content),
      },
    };
    const nodeData = Object.assign({}, block, nodeMeta);
    createNode(nodeData);
    let node = getNode(nodeData.id);

    createParentChildLink({ parent, child: node });

    createNodeField({
      node,
      name: "parentPage___NODE",
      value: page.id,
    });

    block.children?.forEach((grandChild) =>
      makeBlockNode(grandChild, node, page)
    );
  };

  pages.forEach((page) => {
    const content = makeMarkdown(page);

    const nodeMeta = {
      id: createNodeId(`roam-page-${page.title}`),
      parent: dbMeta.id,
      sourceUrl: url,
      children: [],
      internal: {
        type: `RoamPage`,
        mediaType: "text/markdown",
        content,
        contentDigest: createContentDigest(content),
      },
    };
    const nodeData = Object.assign({}, page, nodeMeta);
    createNode(nodeData);
    let node = getNode(nodeData.id);
    createParentChildLink({ parent: dbNode, child: node });
    page.children?.forEach((child) => makeBlockNode(child, node, node));
  });
};
