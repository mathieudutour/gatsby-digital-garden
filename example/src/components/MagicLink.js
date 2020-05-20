import React from "react";
import { Link, navigate, withPrefix } from "gatsby";
import qs from "querystring";

export const MagicLink = ({ to, index, ...restProps }) => {
  return (
    <Link
      {...restProps}
      onClick={(ev) => {
        ev.preventDefault();
        const search = qs.parse(window.location.search.replace(/^\?/, ""));
        let stackedNotes = search.stackedNotes || [];
        if (typeof stackedNotes === "string") {
          stackedNotes = [stackedNotes];
        }
        stackedNotes.splice(index, stackedNotes.length - index, to);
        search.stackedNotes = stackedNotes;
        navigate(
          `${window.location.pathname.replace(
            withPrefix(""),
            ""
          )}?${qs.stringify(search)}`
        );
      }}
    />
  );
};
