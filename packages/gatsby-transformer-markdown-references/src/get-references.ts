export type References = { blocks: string[]; pages: string[] };

// Find matches for content between double brackets
// e.g. [[Example]] -> Example
const bracketRegexExclusive = /(?<=\[\[).*?(?=\]\])/g;

// Find matches for content between double parenthesis
// e.g. ((Example)) -> Example
const parenthesisRegexExclusive = /(?<=\(\().*?(?=\)\))/g;

// Find matches for content after hashtag
// e.g. #Example -> Example
const hashtagRegexExclusive = /(?<=(^|\s)#)\w*\b/g;

export const getReferences = (string: string) => {
  const references: References = {
    blocks: [],
    pages: [],
  };

  const bracketMatches = string.match(bracketRegexExclusive);
  if (bracketMatches !== null) {
    references.pages.push(...bracketMatches);
  }

  const parenthesisMatches = string.match(parenthesisRegexExclusive);
  if (parenthesisMatches !== null) {
    references.blocks.push(...parenthesisMatches);
  }

  const hashtagMatches = string.match(hashtagRegexExclusive);
  if (hashtagMatches !== null) {
    references.pages.push(...hashtagMatches);
  }

  return references;
};
