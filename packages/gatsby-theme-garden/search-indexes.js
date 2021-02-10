const shouldHandleFile = require("./should-handle-file");

module.exports = (options) => {
  const { contentPath, roamUrl } = options;

  if (!contentPath && !roamUrl) {
    return [];
  }

  const filesPath = `
    allFile {
      nodes {
        id
        ext
        sourceInstanceName
        fields {
          title
          slug
        }
        childMdx {
          excerpt
          rawBody
          frontmatter {
            private
          }
        }
        internal {
          mediaType
        }
      }
    }
  `;
  const roamPath = `
    allRoamPage {
      nodes {
        id
        title
        fields {
          slug
        }
        childMdx {
          excerpt
          rawBody
        }
      }
    }
  `;

  const query =
    contentPath && roamUrl
      ? `{
    ${filesPath}
    ${roamPath}
  }`
      : contentPath
      ? `{
    ${filesPath}
  }`
      : `{
    ${roamPath}
  }`;

  return [
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "paths",
        engine: "flexsearch",
        query,

        index: ["path"],

        store: ["id", "path", "title", "excerpt"],

        normalizer: ({ data }) => {
          let result = [];
          if (contentPath) {
            result = result.concat(
              data.allFile.nodes
                .filter((node) => shouldHandleFile(node, options))
                .filter((x) => x.childMdx.frontmatter.private !== true)
                .map((node) => ({
                  id: node.id,
                  path: node.fields.slug,
                  title: node.fields.title,
                  // Replace weirdly formatted [ link ] in excerpt to look like wikilinks ([link])
                  excerpt: node.childMdx.excerpt.replace(
                    /\[\s([\w'-]+)\s\]/gi,
                    (_, p1) => `[${p1}]`
                  ),
                }))
            );
          }
          if (roamUrl) {
            result = result.concat(
              data.allRoamPage.nodes.map((node) => ({
                id: node.id,
                path: node.fields.slug,
                title: node.title,
                // Replace weirdly formatted [ link ] in excerpt to look like wikilinks ([link])
                excerpt: node.childMdx.excerpt.replace(
                  /\[\s([\w'-]+)\s\]/gi,
                  (_, p1) => `[${p1}]`
                ),
              }))
            );
          }
          return result;
        },
      },
    },
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "titles",
        engine: "flexsearch",
        query,

        index: ["title"],

        store: [],

        normalizer: ({ data }) => {
          let result = [];
          if (contentPath) {
            result = result.concat(
              data.allFile.nodes
                .filter((node) => shouldHandleFile(node, options))
                .filter((x) => x.childMdx.frontmatter.private !== true)
                .map((node) => ({
                  id: node.id,
                  title: node.fields.title,
                }))
            );
          }
          if (roamUrl) {
            result = result.concat(
              data.allRoamPage.nodes.map((node) => ({
                id: node.id,
                title: node.title,
              }))
            );
          }
          return result;
        },
      },
    },
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "bodies",
        engine: "flexsearch",
        query,

        index: ["body"],

        store: [],

        normalizer: ({ data }) => {
          let result = [];
          if (contentPath) {
            result = result.concat(
              data.allFile.nodes
                .filter((node) => shouldHandleFile(node, options))
                .filter((x) => x.childMdx.frontmatter.private !== true)
                .map((node) => ({
                  id: node.id,
                  body: node.childMdx.rawBody,
                }))
            );
          }
          if (roamUrl) {
            result = result.concat(
              data.allRoamPage.nodes.map((node) => ({
                id: node.id,
                body: node.childMdx.rawBody,
              }))
            );
          }
          return result;
        },
      },
    },
  ];
};
