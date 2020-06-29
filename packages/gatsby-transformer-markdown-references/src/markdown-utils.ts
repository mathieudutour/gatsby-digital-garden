/**
 * Adapted from vscode-markdown/src/util.ts
 * https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
 */

export const REGEX_FENCED_CODE_BLOCK = /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;

export function markdownHeadingToPlainText(text: string) {
  // Remove Markdown syntax (bold, italic, links etc.) in a heading
  // For example: `_italic_` -> `italic`
  return text.replace(/\[([^\]]*)\]\[[^\]]*\]/, (_, g1) => g1);
}

export function rxMarkdownHeading(level: number): RegExp {
  const pattern = `^#{${level}}\\s+(.+)$`;
  return new RegExp(pattern, "im");
}

export function findTopLevelHeading(md: unknown): string | null {
  if (typeof md !== "string") {
    return null;
  }

  const regex = rxMarkdownHeading(1);
  const match = regex.exec(md);
  if (match) {
    return markdownHeadingToPlainText(match[1]);
  }

  return null;
}

export function cleanupMarkdown(markdown: string) {
  const replacer = (foundStr: string) => foundStr.replace(/[^\r\n]/g, "");
  return markdown
    .replace(REGEX_FENCED_CODE_BLOCK, replacer) //// Remove fenced code blocks
    .replace(/<!--[\W\w]+?-->/g, replacer) //// Remove comments
    .replace(/^---[\W\w]+?(\r?\n)---/, replacer); //// Remove YAML front matter
}

export function findInMarkdown(markdown: string, regex: RegExp): string[] {
  const unique = new Set<string>();

  let match;
  while ((match = regex.exec(markdown))) {
    const [, name] = match;
    if (name) {
      unique.add(name);
    }
  }

  return Array.from(unique);
}
