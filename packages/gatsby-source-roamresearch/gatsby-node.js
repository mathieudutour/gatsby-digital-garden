exports.onPreBootstrap = require("./lib/on-pre-bootstrap").onPreBoostrap;
exports.sourceNodes = require("./lib/source-nodes").sourceNodes;
// exports.createSchemaCustomization = require("./lib/create-schema-customization").createSchemaCustomization;

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    url: Joi.string()
      .required()
      .description("Url to the Roam Research database"),
    email: Joi.string()
      .required()
      .description("Email used to sign into Roam Research"),
    password: Joi.string()
      .required()
      .description("Password used to sign into Roam Research"),
    headless: Joi.boolean()
      .default(true)
      .description(
        "Whether to use Puppeteer in headless mode to fetch the Roam Research data or not"
      ),
  });
};
