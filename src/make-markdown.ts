import { RoamPage, RoamBlock } from "./roam-schema";

// Find matches for content between double brackets
// e.g. [[Example]] -> Example
const bracketRegexExclusive = /(?<=\[\[).*?(?=\]\])/g;

// Find matches for content after hashtag
// e.g. #Example -> Example
const hashtagRegexExclusive = /(?<=(^|\s)#)\w*\b/g;

const getReferences = (string: string) => {
  const links = [];

  const bracketMatches = string.match(bracketRegexExclusive);
  if (bracketMatches !== null) {
    links.push(...bracketMatches);
  }

  const hashtagMatches = string.match(hashtagRegexExclusive);
  if (hashtagMatches !== null) {
    links.push(...hashtagMatches);
  }

  return links;
};

export const makeMarkdownForBlock = (block: RoamBlock, indent: string = "") => {
  const outboundReferences = getReferences(block.string);
  let res = block.string;

  block.children?.forEach((child) => {
    const resForBlock = makeMarkdownForBlock(child, `${indent}  `);
    outboundReferences.push(...resForBlock.outboundReferences);
    res += `\n${indent}- ${resForBlock.string}`;
  });

  return { string: res, outboundReferences };
};

export const makeMarkdown = (page: RoamPage) => {
  const outboundReferences = getReferences(page.title);
  let res = `# ${page.title}`;

  page.children?.forEach((block) => {
    const resForBlock = makeMarkdownForBlock(block);
    outboundReferences.push(...resForBlock.outboundReferences);
    res += `\n- ${resForBlock.string}`;
  });

  return { string: res, outboundReferences };
};
