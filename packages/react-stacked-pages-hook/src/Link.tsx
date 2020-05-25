import React, { useCallback } from "react";
import { GatsbyLinkProps, Link } from "gatsby";
import { useStackedPages } from "./hooks";

export const LinkToStacked = React.forwardRef(
  (
    {
      to,
      onClick,
      onMouseLeave,
      onMouseEnter,
      ...restProps
    }: GatsbyLinkProps<any>,
    ref
  ) => {
    const [, navigateToStackedPage, highlightStackedPage] = useStackedPages();
    const onClickHandler = useCallback(
      (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        if (onClick) {
          onClick(ev);
        }
        navigateToStackedPage(to);
      },
      [navigateToStackedPage, to, onClick]
    );

    const onMouseEnterHandler = useCallback(
      (ev: React.MouseEvent<HTMLAnchorElement>) => {
        highlightStackedPage(to, true);
        if (onMouseEnter) {
          onMouseEnter(ev);
        }
      },
      [to, onMouseEnter, highlightStackedPage]
    );

    const onMouseLeaveHandler = useCallback(
      (ev: React.MouseEvent<HTMLAnchorElement>) => {
        highlightStackedPage(to, false);
        if (onMouseLeave) {
          onMouseLeave(ev);
        }
      },
      [to, onMouseLeave, highlightStackedPage]
    );

    return (
      <Link
        {...restProps}
        to={to /*
        // @ts-ignore */}
        ref={ref}
        onClick={onClickHandler}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      />
    );
  }
);
