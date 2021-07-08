exports.onCreateNode = require("./lib/on-create-node.js").onCreateNode;
exports.createSchemaCustomization = require("./lib/create-schema-customization").createSchemaCustomization;
exports.setFieldsOnGraphQLNodeType = require("./lib/create-schema-customization").setFieldsOnGraphQLNodeType;

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    types: Joi.array()
      .items(Joi.string())
      .default(["Mdx"])
      .description("The types of the nodes to transform"),
  });
};
