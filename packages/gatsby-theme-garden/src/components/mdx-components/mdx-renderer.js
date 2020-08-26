import React from "react";
import { mdx } from "@mdx-js/react";

export default function MDXRenderer({ children, ...props }) {
  // Memoize the compiled component
  const End = React.useMemo(() => {
    if (!children) {
      return null;
    }

    const fn = new Function(`_fn`, "React", "mdx", `${children}`);

    return fn({}, React, mdx);
  }, [children]);

  return React.createElement(End, { ...props });
}
