const path = require("path");

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
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
};
