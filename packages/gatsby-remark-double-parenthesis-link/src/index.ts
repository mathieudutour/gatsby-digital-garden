import visit from "unist-util-visit";
import { Node } from "unist";
import slugify from "slugify";
import type { Text } from "mdast";

/**
 * if title is something like `folder1/folder2/name`,
 * will slugify the name, while keeping the folder names
 */
const defaultTitleToURLPath = (title: string) => {
  const segments = title.split("/");
  const slugifiedTitle = slugify(segments.pop() as string);
  return `${segments.join("/")}/${slugifiedTitle}`;
};

// Find matches for content between double parenthesis
// e.g. ((Example)) -> Example
const parenthesisRegexExclusive = /(?<=\(\().*?(?=\)\))/g;

const addDoubleParenthesisLinks = (
  { markdownAST }: { markdownAST: Node },
  options?: { idToURL?: (title: string) => string }
) => {
  const idToURL = options?.idToURL || defaultTitleToURLPath;

  visit<Text>(markdownAST, `text`, (node, index, parent) => {
    const value = node.value;
    if (
      typeof value !== "string" ||
      !parent ||
      !index ||
      !Array.isArray(parent.children)
    ) {
      return;
    }
    const matches = value.match(parenthesisRegexExclusive);

    if (!matches) {
      return;
    }

    const children: (string | { id: string })[] = [value];
    matches.forEach((match) => {
      const last = children.pop();
      if (typeof last !== "string") {
        return;
      }
      const split = `((${match}))`;
      const [first, ...rest] = last.split(split);
      children.push(first, { id: match }, rest.join(split));
    });

    parent.children.splice(
      index,
      1,
      ...children.map((child) => {
        if (typeof child === "string") {
          return {
            type: "text",
            value: child,
          };
        }
        return {
          type: "link",
          url: idToURL(child.id),
          title: `__roam_block_${child.id}`,
          children: [{ type: "text", value: child.id }],
        };
      })
    );
  });
};

export default addDoubleParenthesisLinks;
