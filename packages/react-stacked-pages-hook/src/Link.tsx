import React, { useCallback } from "react";
import { GatsbyLinkProps, Link, withPrefix } from "gatsby";
import { useStackedPage } from "./hooks";

export const LinkToStacked = React.forwardRef(
  (
    {
      to,
      onClick,
      onMouseLeave,
      onMouseEnter,
      ...restProps
    }: GatsbyLinkProps<any>,
    ref: React.Ref<Link<any>>
  ) => {
    const [
      ,
      ,
      ,
      navigateToStackedPage,
      highlightStackedPage,
    ] = useStackedPage();
    const onClickHandler = useCallback(
      (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        if (onClick) {
          onClick(ev);
        }
        if (ev.metaKey || ev.ctrlKey) {
          window.open(withPrefix(to), "_blank");
        } else {
          navigateToStackedPage(to);
        }
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
