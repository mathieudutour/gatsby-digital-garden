import React from "react";
import { Link } from "gatsby";

import useSiteMetadata from "../use-site-metadata";
import DarkModeToggle from "../components/dark-mode-toggle";

import "./header.css";

const Header = () => {
  const siteMetadata = useSiteMetadata();

  return (
    <header>
      <Link to="/">
        <h3>{siteMetadata.title}</h3>
      </Link>
      <DarkModeToggle />
    </header>
  );
};

export default Header;
