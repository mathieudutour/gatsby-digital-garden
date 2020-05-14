const path = require(`path`);
const { slash } = require(`gatsby-core-utils`);
const slugify = require("slugify");

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `RoamPage`) {
    createNodeField({
      node,
      name: `slug`,
      value: slugify(node.title),
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

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
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  const component = path.join(__dirname, "./src/templates/note.js");

  result.data.allRoamPage.nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component,
      context: {
        id: node.id,
      },
    });
  });
};
