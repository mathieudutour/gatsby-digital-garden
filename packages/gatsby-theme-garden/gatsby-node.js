const fs = require(`fs`);
const path = require(`path`);
const { urlResolve, createContentDigest } = require(`gatsby-core-utils`);
const slugify = require(`slugify`);
const {
  findTopLevelHeading,
} = require(`gatsby-transformer-markdown-references`);

// These are customizable theme options we only need to check once
let basePath;
let contentPath;
let roamUrl;
let rootNote;
let extensions;
let mediaTypes;

exports.onPreBootstrap = async ({ store }, themeOptions) => {
  const { program } = store.getState();

  basePath = themeOptions.basePath || `/`;
  contentPath = themeOptions.contentPath;
  roamUrl = themeOptions.roamUrl;
  rootNote = themeOptions.rootNote;
  extensions = themeOptions.extensions || [".md", ".mdx"];
  mediaTypes = themeOptions.mediaTypes || ["text/markdown", "text/x-markdown"];

  if (contentPath) {
    const dir = path.isAbsolute(contentPath)
      ? contentPath
      : path.join(program.directory, contentPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  if (contentPath && roamUrl) {
    await copyFile(
      path.join(__dirname, "./fragments/file-and-roam.fragment"),
      `${program.directory}/.cache/fragments/garden-fragments.js`
    );
    await copyFile(
      path.join(__dirname, "./fragments/file-and-roam-graph.fragment"),
      path.join(__dirname, "./src/use-graph-data.js")
    );
  } else if (contentPath) {
    await copyFile(
      path.join(__dirname, "./fragments/file.fragment"),
      `${program.directory}/.cache/fragments/garden-fragments.js`
    );
    await copyFile(
      path.join(__dirname, "./fragments/file-graph.fragment"),
      path.join(__dirname, "./src/use-graph-data.js")
    );
  } else if (roamUrl) {
    await copyFile(
      path.join(__dirname, "./fragments/roam.fragment"),
      `${program.directory}/.cache/fragments/garden-fragments.js`
    );
    await copyFile(
      path.join(__dirname, "./fragments/roam-graph.fragment"),
      path.join(__dirname, "./src/use-graph-data.js")
    );
  }
};

function getTitle(node, content) {
  if (
    typeof node.frontmatter === "object" &&
    node.frontmatter &&
    node.frontmatter["title"]
  ) {
    return node.frontmatter["title"];
  }
  return (
    findTopLevelHeading(content) ||
    (typeof node.fileAbsolutePath === "string"
      ? path.basename(
          node.fileAbsolutePath,
          path.extname(node.fileAbsolutePath)
        )
      : "") ||
    (typeof node.absolutePath === "string"
      ? path.basename(node.absolutePath, path.extname(node.absolutePath))
      : "")
  );
}

function shouldHandleFile(node, options) {
  return (
    (extensions.includes(node.ext) ||
      mediaTypes.includes(node.internal.mediaType)) &&
    node.sourceInstanceName === contentPath
  );
}

exports.onCreateNode = async ({ node, actions, loadNodeContent }, options) => {
  const { createNodeField } = actions;

  if (node.internal.type === `RoamPage` && node.sourceUrl === roamUrl) {
    createNodeField({
      node,
      name: `slug`,
      value: urlResolve(basePath, slugify(node.title)),
    });
  }
  if (node.internal.type === `RoamBlock` && node.sourceUrl === roamUrl) {
    if (!node.uid) {
      return;
    }
    createNodeField({
      node,
      name: `slug`,
      value: urlResolve(basePath, slugify(node.uid)),
    });
  }
  if (node.internal.type === `File` && shouldHandleFile(node)) {
    createNodeField({
      node,
      name: `slug`,
      value: urlResolve(basePath, path.parse(node.relativePath).dir, node.name),
    });
    createNodeField({
      node,
      name: `title`,
      value: getTitle(node, await loadNodeContent(node)),
    });
  }
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MdxFrontmatter: {
      private: {
        type: `Boolean`,
        resolve(source, args, context, info) {
          const { private } = source;
          if (private == null) {
            return false;
          }
          return private;
        },
      },
    },
  };
  createResolvers(resolvers);
};

async function copyFile(from, to) {
  return fs.promises.writeFile(to, await fs.promises.readFile(from));
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  if (contentPath) {
    const result = await graphql(
      `
        {
          allFile {
            nodes {
              id
              sourceInstanceName
              ext
              internal {
                mediaType
              }
              fields {
                slug
              }
              childMdx {
                frontmatter {
                  private
                }
              }
            }
          }
        }
      `
    );

    if (result.errors) {
      console.log(result.errors);
      throw new Error(`Could not query notes`, result.errors);
    }

    await copyFile(
      path.join(__dirname, "./templates/local-file.template"),
      path.join(__dirname, "./src/templates/local-file.js")
    );

    const LocalFileTemplate = require.resolve(`./src/templates/local-file`);

    const localFiles = result.data.allFile.nodes
      .filter(shouldHandleFile)
      .filter((x) => x.childMdx.frontmatter.private !== true);

    localFiles.forEach((node) => {
      createPage({
        path: node.fields.slug,
        component: LocalFileTemplate,
        context: {
          id: node.id,
        },
      });
    });

    if (rootNote) {
      const root = localFiles.find((node) => node.fields.slug === rootNote);
      if (root) {
        createPage({
          path: basePath,
          component: LocalFileTemplate,
          context: {
            id: root.id,
          },
        });
      }
    }
  } else {
    try {
      await fs.promises.unlink(
        path.join(__dirname, "./src/templates/local-file.js")
      );
    } catch (err) {}
  }

  if (roamUrl) {
    const result = await graphql(
      `
        {
          allRoamPage {
            nodes {
              id
              sourceUrl
              fields {
                slug
              }
            }
          }
          allRoamBlock {
            nodes {
              id
              sourceUrl
              fields {
                slug
              }
            }
          }
        }
      `
    );

    if (result.errors) {
      console.log(result.errors);
      throw new Error(`Could not query Roam`, result.errors);
    }

    await copyFile(
      path.join(__dirname, "./templates/roam-block.template"),
      path.join(__dirname, "./src/templates/roam-block.js")
    );
    await copyFile(
      path.join(__dirname, "./templates/roam-page.template"),
      path.join(__dirname, "./src/templates/roam-page.js")
    );

    const RoamBlockTemplate = require.resolve(`./src/templates/roam-block`);
    const RoamPageTemplate = require.resolve(`./src/templates/roam-page`);

    const roamBlocks = result.data.allRoamBlock.nodes.filter(
      (node) => node.sourceUrl === roamUrl
    );

    roamBlocks.forEach((node) =>
      createPage({
        path: node.fields.slug,
        component: RoamBlockTemplate,
        context: {
          id: node.id,
        },
      })
    );

    const roamPages = result.data.allRoamPage.nodes.filter(
      (node) => node.sourceUrl === roamUrl
    );

    roamPages.forEach((node) =>
      createPage({
        path: node.fields.slug,
        component: RoamPageTemplate,
        context: {
          id: node.id,
        },
      })
    );

    if (rootNote) {
      const root = roamPages.find((node) => node.fields.slug === rootNote);
      if (root) {
        createPage({
          path: basePath,
          component: RoamPageTemplate,
          context: {
            id: root.id,
          },
        });
      }
    }
  } else {
    try {
      await fs.promises.unlink(
        path.join(__dirname, "./src/templates/roam-block.js")
      );
      await fs.promises.unlink(
        path.join(__dirname, "./src/templates/roam-page.js")
      );
    } catch (err) {}
  }
};
