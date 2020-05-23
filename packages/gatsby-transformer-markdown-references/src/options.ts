export type PluginOptions = {
  types?: string[];
};

const defaultOptions = {
  types: ["Mdx"],
};

export const resolveOptions = (options?: PluginOptions) => {
  return { ...defaultOptions, ...options };
};
