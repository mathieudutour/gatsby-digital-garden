const path = require("path");
const slugify = require("slugify");

require("dotenv").config({
  path: `.env`,
});

module.exports = {
  pathPrefix: `/gatsby-source-roamresearch`,
  siteMetadata: {
    title: `Gatsby with Roam Research`,
  },
  plugins: [
    {
      resolve: path.join(__dirname, "../packages/gatsby-source-roamresearch"),
      options: {
        url: process.env.ROAM_URL,
        email: process.env.ROAM_EMAIL,
        password: process.env.ROAM_PASSWORD,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          path.join(
            __dirname,
            "../packages/gatsby-remark-double-brackets-link"
          ),
          path.join(
            __dirname,
            "../packages/gatsby-remark-double-parenthesis-link"
          ),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
};
