import React, { useState, useCallback } from "react";
import { navigate } from "gatsby";
import Downshift from "downshift";
import useSearch from "../use-search";

import "./search.css";

export function Search() {
  const [query, setQuery] = useState("");

  const results = useSearch(query);

  const handleChange = useCallback((e) => setQuery(e.target.value), [setQuery]);

  return (
    <Downshift
      onChange={(selection) => navigate(selection.path)}
      itemToString={(item) => (item ? item.title : "")}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        getRootProps,
      }) => (
        <div
          className="searchWrapper"
          {...getRootProps({}, { suppressRefError: true })}
        >
          <SearchBar
            query={query}
            onChange={handleChange}
            getInputProps={getInputProps}
          />
          <Results
            isOpen={isOpen}
            getMenuProps={getMenuProps}
            getItemProps={getItemProps}
            results={results}
            highlightedIndex={highlightedIndex}
          />
        </div>
      )}
    </Downshift>
  );
}

function SearchBar({ query, onChange, getInputProps }) {
  return (
    <div className="inputWrapper">
      <svg
        className="searchIcon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M23.111 20.058l-4.977-4.977c.965-1.52 1.523-3.322 1.523-5.251 0-5.42-4.409-9.83-9.829-9.83-5.42 0-9.828 4.41-9.828 9.83s4.408 9.83 9.829 9.83c1.834 0 3.552-.505 5.022-1.383l5.021 5.021c2.144 2.141 5.384-1.096 3.239-3.24zm-20.064-10.228c0-3.739 3.043-6.782 6.782-6.782s6.782 3.042 6.782 6.782-3.043 6.782-6.782 6.782-6.782-3.043-6.782-6.782z" />
      </svg>
      <input
        {...getInputProps({
          placeholder: "Search...",
          onChange: onChange,
        })}
        type="text"
      />
    </div>
  );
}

function Results({
  isOpen,
  results,
  getItemProps,
  getMenuProps,
  highlightedIndex,
}) {
  return (
    isOpen && (
      <ul className="results" {...getMenuProps()}>
        {results.map((r, index) => (
          <li
            key={r.id}
            {...getItemProps({
              index,
              item: r,
              style: {
                background:
                  highlightedIndex === index
                    ? "var(--references-bg)"
                    : "var(--note-bg)",
              },
            })}
          >
            <div className="title">{r.title}</div>
            <div className="excerpt">{r.excerpt}</div>
          </li>
        ))}
      </ul>
    )
  );
}
