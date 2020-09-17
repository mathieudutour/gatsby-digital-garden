import React from "react";
import { Link } from "gatsby";

import useSiteMetadata from "../use-site-metadata";
import DarkModeToggle from "./dark-mode-toggle";
import GraphButton from "./graph-button";
import { Search } from "./search";

import "./header.css";

const Header = () => {
  const siteMetadata = useSiteMetadata();

  return (
    <header>
      <Link to="/">
        <h3>{siteMetadata.title}</h3>
      </Link>
      <div className="controls">
        <Search />
        <GraphButton />
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
