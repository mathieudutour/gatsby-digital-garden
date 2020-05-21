import React, { useCallback } from "react";
import { GatsbyLinkProps, Link } from "gatsby";
import { useStackedPages } from "./hooks";

export const LinkToStacked = React.forwardRef(
  ({ to, ...restProps }: GatsbyLinkProps<any>, ref) => {
    const [, navigateToStackedPage] = useStackedPages();
    const onClick = useCallback(
      (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        navigateToStackedPage(to);
      },
      [navigateToStackedPage, to]
    );
    // @ts-ignore
    return <Link {...restProps} to={to} ref={ref} onClick={onClick} />;
  }
);
