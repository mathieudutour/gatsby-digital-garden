import { findInMarkdown, cleanupMarkdown } from "./markdown-utils";

export type References = { blocks: string[]; pages: string[] };

export function rxWikiLink(): RegExp {
  const pattern = "\\[\\[([^\\]]+)\\]\\]"; // [[wiki-link-regex]]
  return new RegExp(pattern, "ig");
}

export function rxBlockLink(): RegExp {
  const pattern = "\\(\\(([^\\]]+)\\)\\)"; // ((block-link-regex))
  return new RegExp(pattern, "ig");
}

export function rxHashtagLink(): RegExp {
  const pattern = "(?:^|\\s)#([^\\s]+)"; // #hashtag
  return new RegExp(pattern, "ig");
}

export const getReferences = (string: string) => {
  const md = cleanupMarkdown(string);

  const references: References = {
    blocks: findInMarkdown(md, rxBlockLink()),
    pages: findInMarkdown(md, rxHashtagLink()).concat(
      findInMarkdown(md, rxWikiLink())
    ),
  };

  return references;
};
