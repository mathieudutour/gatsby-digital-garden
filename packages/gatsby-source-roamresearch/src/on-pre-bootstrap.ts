import { Reporter } from "gatsby";

export const onPreBoostrap = (
  { reporter }: { reporter: Reporter },
  options?: { [key: string]: unknown }
) => {
  const { url, email, password } = options || {};
  const errors: string[] = [];
  if (typeof url !== "string") {
    errors.push("`url` option needs to be a string");
  }
  if (typeof email !== "string") {
    errors.push("`email` option needs to be a string");
  }
  if (typeof password !== "string") {
    errors.push("`password` option needs to be a string");
  }

  if (errors.length) {
    reporter.panic(`Problems with gatsby-source-roamresearch plugin options:
${errors.join("\n")}`);
  }
};
