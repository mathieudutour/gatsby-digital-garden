import { CreateNodeArgs, Node } from "gatsby";
import { getReferences } from "./get-references";
import { PluginOptions, resolveOptions } from "./options";
import { clearInboundReferences, setCachedNode } from "./cache";
import { findTopLevelHeading } from "./markdown-utils";

function getTitle(node: Node, content: string) {
  if (
    typeof node.frontmatter === "object" &&
    node.frontmatter &&
    "title" in node.frontmatter &&
    // @ts-ignore
    node.frontmatter["title"]
  ) {
    // @ts-ignore
    return node.frontmatter["title"] as string;
  }
  return findTopLevelHeading(content) || "";
}

function getAliases(node: Node) {
  if (
    typeof node.frontmatter === "object" &&
    node.frontmatter &&
    "aliases" in node.frontmatter &&
    // @ts-ignore
    Array.isArray(node.frontmatter["aliases"])
  ) {
    // @ts-ignore
    return node.frontmatter["aliases"] as string[];
  }
  return [];
}

export const onCreateNode = async (
  { cache, node, loadNodeContent }: CreateNodeArgs,
  _options?: PluginOptions
) => {
  const options = resolveOptions(_options);

  // if we shouldn't process this node, then return
  if (!options.types.includes(node.internal.type)) {
    return;
  }

  const content = await loadNodeContent(node);

  const outboundReferences = getReferences(content);

  const title = getTitle(node, content);
  const aliases = getAliases(node);

  await clearInboundReferences(cache);
  await setCachedNode(cache, node.id, {
    node,
    outboundReferences,
    title,
    aliases,
  });
};
