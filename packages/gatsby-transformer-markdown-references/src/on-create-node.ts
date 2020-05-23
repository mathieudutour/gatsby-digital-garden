import { CreateNodeArgs, Node } from "gatsby";
import * as fs from "fs";
import * as path from "path";
import { getReferences } from "./get-references";
import { PluginOptions, resolveOptions } from "./options";

function getTitle(node: Node, content: string) {
  if (
    node.frontmatter &&
    typeof node.frontmatter === "object" &&
    "title" in node.frontmatter &&
    // @ts-ignore
    node.frontmatter["title"]
  ) {
    // @ts-ignore
    return node.frontmatter["title"] as string;
  }
  return content.split("\n")[0].replace(/^# /, "");
}

function getAliases(node: Node) {
  if (
    node.frontmatter &&
    typeof node.frontmatter === "object" &&
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

  // @ts-ignore
  const cacheDirectory: string = cache.directory;
  try {
    // invalidate the previous cache
    await fs.promises.unlink(
      path.join(cacheDirectory, "___inboundReferences.json")
    );
  } catch (err) {}
  await fs.promises.writeFile(
    path.join(cacheDirectory, `${encodeURIComponent(node.id)}.json`),
    JSON.stringify({ outboundReferences, title, aliases })
  );
};
