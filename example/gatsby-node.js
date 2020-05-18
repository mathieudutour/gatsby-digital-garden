const path = require(`path`);
const { slash } = require(`gatsby-core-utils`);
const slugify = require("slugify");

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `RoamPage`) {
    createNodeField({
      node,
      name: `slug`,
      value: `/${slugify(node.title)}`,
    });
  }
  if (node.internal.type === `RoamBlock`) {
    if (!node.uid) {
      return;
    }
    createNodeField({
      node,
      name: `slug`,
      value: `/${slugify(node.uid)}`,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  const result = await graphql(
    `
      {
        allRoamPage(limit: 1000) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
        allRoamBlock(limit: 1000) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  const componentPage = path.join(__dirname, "./src/templates/page.js");
  const componentBlock = path.join(__dirname, "./src/templates/block.js");

  result.data.allRoamPage.nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: componentPage,
      context: {
        id: node.id,
      },
    });
  });
  result.data.allRoamBlock.nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: componentBlock,
      context: {
        id: node.id,
      },
    });
  });
};
