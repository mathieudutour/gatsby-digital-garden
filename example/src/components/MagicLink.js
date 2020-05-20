import React from "react";
import { Link } from "gatsby";
import { useStackedNotes } from "../hooks/use-stacked-notes";

export const MagicLink = React.forwardRef(
  ({ to, index, ...restProps }, ref) => {
    const [, navigateToNote] = useStackedNotes();
    return (
      <Link
        {...restProps}
        to={to}
        ref={ref}
        onClick={(ev) => {
          ev.preventDefault();
          navigateToNote(to, index);
        }}
      />
    );
  }
);
