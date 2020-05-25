const path = require("path");
const slugify = require("slugify");

require("dotenv").config({
  path: `.env`,
});

module.exports = {
  pathPrefix: `/gatsby-n-roamresearch`,
  siteMetadata: {
    title: `Example of using Roam Research as a data source for a Gatsby site`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/notes`,
      },
    },
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
      resolve: path.join(
        __dirname,
        "../packages/gatsby-transformer-markdown-references"
      ),
    },
  ],
};
