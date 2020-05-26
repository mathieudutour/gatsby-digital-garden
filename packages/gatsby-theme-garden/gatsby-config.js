module.exports = (options) => {
  const {
    mdxOtherwiseConfigured = false,
    contentPath,
    roamUrl,
    roamEmail,
    roamPassword,
  } = options;

  return {
    siteMetadata: {
      title: `Digital Garden Title Placeholder`,
      description: `Description placeholder`,
      siteUrl: `http://example.com/`,
    },
    plugins: [
      !mdxOtherwiseConfigured && {
        resolve: `gatsby-plugin-mdx`,
        options: {
          extensions: [`.md`, `.mdx`],
          gatsbyRemarkPlugins: [
            "gatsby-remark-double-brackets-link",
            "gatsby-remark-double-parenthesis-link",
          ],
        },
      },
      roamUrl && {
        resolve: "gatsby-source-roamresearch",
        options: {
          url: roamUrl,
          email: roamEmail,
          password: roamPassword,
        },
      },
      contentPath && {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: contentPath,
          name: contentPath,
        },
      },
      `gatsby-transformer-markdown-references`,
      {
        resolve: `gatsby-plugin-compile-es6-packages`,
        options: {
          modules: [`gatsby-theme-garden`],
        },
      },
    ].filter(Boolean),
  };
};
