import { graphql, useStaticQuery } from "gatsby";

export default () => {
  const data = useStaticQuery(graphql`
    {
      gardenConfig(id: { eq: "gatsby-theme-garden-config" }) {
        basePath
      }
    }
  `);

  return data.notesConfig;
};
