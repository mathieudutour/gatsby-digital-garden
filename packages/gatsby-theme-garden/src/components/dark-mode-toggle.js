import React from "react";
import useDarkMode from "use-dark-mode";

import "./dark-mode-toggle.css";

const DarkModeToggle = () => {
  const { value: isDark, toggle: toggleDarkMode } = useDarkMode(false);

  return (
    <label
      className="dark-mode-toggle"
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
      title={isDark ? "Activate light mode" : "Activate dark mode"}
    >
      <input type="checkbox" checked={!isDark} onChange={toggleDarkMode} />
      <div />
    </label>
  );
};

export default DarkModeToggle;
