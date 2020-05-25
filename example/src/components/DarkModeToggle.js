import React from "react";
import useDarkMode from "use-dark-mode";

import "./DarkModeToggle.css";

export const DarkModeToggle = () => {
  const { value: isDark, toggle: toggleDarkMode } = useDarkMode(false);

  return (
    <label
      className="dayNight"
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
      title={isDark ? "Activate light mode" : "Activate dark mode"}
    >
      <input type="checkbox" checked={!isDark} onChange={toggleDarkMode} />
      <div />
    </label>
  );
};
