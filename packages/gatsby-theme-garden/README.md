# gatsby-theme-garden

A Gatsby theme for publishing a digital garden.

## Installation

### For a new site

If you're creating a new site and want to use the garden theme, you can use the garden theme starter. This will generate a new site that pre-configures use of the garden theme.

```shell
gatsby new my-digital-garden https://github.com/mathieudutour/gatsby-starter-digital-garden
```

### Manually add to your site

1. Install the theme

```shell
npm install gatsby-theme-garden
```

2. Add the configuration to your `gatsby-config.js` file

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-garden`,
      options: {
        // basePath defaults to `/`
        basePath: `/garden`,
        rootNote: `/garden/About-these-notes`,
        contentPath: `/content/garden`,
      },
    },
  ],
};
```

3. Add notes to your site by creating `md` or `mdx` files inside `/content/garden`.

4. Run your site using `gatsby develop` and navigate to your notes. If you used the above configuration, your URL will be `http://localhost:8000/garden`

> You can also use a Roam Research database to source your notes. Specify the `roamUrl`, `roamEmail` and `roamPassword` options to do so. More information on [gatsby-source-roamresearch](../gatsby-source-roamresearch)

### Options

| Key                      | Default value | Description                                                                      |
| ------------------------ | ------------- | -------------------------------------------------------------------------------- |
| `basePath`               | `/`           | Root url for the garden                                                          |
| `rootNote`               |               | The URL of the note to use as the root                                           |
| `contentPath`            |               | Location of local content                                                        |
| `roamUrl`                |               | The URL of your Roam Research database                                           |
| `roamEmail`              |               | Email used to sign into Roam Research                                            |
| `roamPassword`           |               | Password used to sign into Roam Research                                         |
| `mdxOtherwiseConfigured` | `false`       | Set this flag `true` if `gatsby-plugin-mdx` is already configured for your site. |
