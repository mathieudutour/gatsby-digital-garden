import { graphql, useStaticQuery } from "gatsby";

export default () => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  return data.site.siteMetadata;
};
