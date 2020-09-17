import React from "react";
import { Helmet } from "react-helmet";
import useSiteMetadata from "../use-site-metadata";

function SEO({ description, lang, meta, title }) {
  const metadata = useSiteMetadata();

  const metaDescription = description || metadata.description;
  const metaTitle = title || metadata.title;

  return (
    <Helmet
      htmlAttributes={{
        lang: lang || "en",
      }}
      title={metaTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: metadata.author,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta || [])}
    />
  );
}

export default SEO;
