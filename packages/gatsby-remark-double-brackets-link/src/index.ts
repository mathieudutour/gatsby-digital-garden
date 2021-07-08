import visit from "unist-util-visit";
import { Node } from "unist";
import slugify from "slugify";
import type { Definition, LinkReference } from "mdast";

/**
 * if title is something like `folder1/folder2/name`,
 * will slugify the name, while keeping the folder names
 */
const defaultTitleToURLPath = (title: string) => {
  const segments = title.split("/");
  const slugifiedTitle = slugify(segments.pop() as string);
  return `${segments.join("/")}/${slugifiedTitle}`;
};

const addDoubleBracketsLinks = (
  { markdownAST }: { markdownAST: Node },
  options?: {
    titleToURLPath?: string;
    stripBrackets?: boolean;
    parseWikiLinks?: boolean;
  }
) => {
  const titleToURL = options?.titleToURLPath
    ? require(options.titleToURLPath)
    : defaultTitleToURLPath;

  const definitions: { [identifier: string]: boolean } = {};

  visit<Definition>(markdownAST, `definition`, (node) => {
    if (!node.identifier || typeof node.identifier !== "string") {
      return;
    }
    definitions[node.identifier] = true;
  });

  visit<LinkReference>(markdownAST, `linkReference`, (node, index, parent) => {
    if (
      node.referenceType !== "shortcut" ||
      (typeof node.identifier === "string" && definitions[node.identifier])
    ) {
      return;
    }
    const siblings = parent?.children;
    if (!index || !siblings || !Array.isArray(siblings)) {
      return;
    }
    const previous: any = siblings[index - 1];
    const next: any = siblings[index + 1];

    if (!previous || !next) {
      return;
    }

    if (
      previous.type !== "text" ||
      !previous.value ||
      previous.value[previous.value.length - 1] !== "[" ||
      next.type !== "text" ||
      next.value[0] !== "]"
    ) {
      return;
    }

    previous.value = previous.value.replace(/\[$/, "");
    next.value = next.value.replace(/^\]/, "");

    let heading = "";

    if (options?.parseWikiLinks && Array.isArray(node.children)) {
      let label = node.label as string;
      if (label.match(/#/) && Array.isArray(node.children)) {
        // @ts-ignore
        [node.children[0].value, heading] = label.split("#");
        [heading] = heading.split("|");
        node.label = label.replace(`#${heading}`, "");
      }

      label = node.label as string;
      if (label.match(/\|/)) {
        // @ts-ignore
        [node.label, node.children[0].value] = label.split("|");
      }
    }

    if (!options?.stripBrackets && Array.isArray(node.children)) {
      // @ts-ignore
      node.children[0].value = `[[${node.children[0].value}]]`;
    }

    // @ts-ignore
    node.type = "link";
    // @ts-ignore
    node.url = `${titleToURL(node.label as string)}${
      heading
        ? `#${slugify(heading, {
            lower: true,
          })}`
        : ""
    }`;
    // @ts-ignore
    node.title = node.label;

    delete node.label;
    // @ts-ignore
    delete node.referenceType;
    // @ts-ignore
    delete node.identifier;
  });
};

export default addDoubleBracketsLinks;
