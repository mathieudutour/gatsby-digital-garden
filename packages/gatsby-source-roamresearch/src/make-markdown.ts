import { RoamPage, RoamBlock } from "fetch-roamresearch";

function replaceSpecialCharacter(string: string) {
  return string.replace(/</g, "&#x3C;").replace(/>/g, "&#x3E;");
}

export const makeMarkdownForBlock = (block: RoamBlock, indent: string = "") => {
  let res = replaceSpecialCharacter(block.string);

  block.children?.forEach((child) => {
    const resForBlock = makeMarkdownForBlock(child, `${indent}  `);

    res += `\n${indent}  - ${resForBlock}`;
  });

  return res;
};

export const makeMarkdown = (page: RoamPage | RoamBlock) => {
  const value = "title" in page ? page.title : page.string;
  let res = `# ${replaceSpecialCharacter(value)}`;

  page.children?.forEach((block) => {
    const resForBlock = makeMarkdownForBlock(block);
    res += `\n- ${resForBlock}`;
  });

  return res;
};
