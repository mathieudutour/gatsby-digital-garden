# react-stacked-pages-hook

Manage a stack of pages in Gatsby. It allows you to display multiple Gatsby page on the same one at runtime.

## Installation

```bash
npm install react-stacked-pages-hook
```

## Usage

In your layout component:

```js
import React, { useEffect, useRef, useCallback } from "react";
import Page from "../components/Page";
import {
  useStackedPagesProvider,
  LinkToStacked,
} from "react-stacked-pages-hook";

// A wrapper component to render the content of a page when stacked
const StackedPageWrapper = ({
  PageIndexProvider,
  children,
  slug,
  overlay,
  obstructed,
  highlighted,
  i,
}) => (
  <PageIndexProvider value={i}>
    <div
      className={`page-container ${overlay ? "page-container-overlay" : ""} ${
        obstructed ? "page-container-obstructed" : ""
      }  ${highlighted ? "page-container-highlighted" : ""}`}
      style={{ left: 40 * i, right: -585 }}
    >
      <div className="page-content">{children}</div>
      <LinkToStacked to={slug} className="obstructed-label">
        {slug}
      </LinkToStacked>
    </div>
  </PageIndexProvider>
);

const StackedLayout = ({ data, location, slug }) => {
  // Use this callback to update what you want to stack.
  // `pageQuery` will be similar to the props you get in a Page component.
  // You can return `null` to filter out the page
  const processPageQuery = useCallback((pageQuery) => pageQuery, []);

  const [
    stackedPages,
    stackedPageStates,
    ContextProvider,
    PageIndexProvider,
    scrollContainer,
    navigateToStackedPage,
    highlightStackedPage,
  ] = useStackedNotesProvider({
    firstPage: { data, slug },
    location,
    processPageQuery,
    containerRef: scrollContainer,
    pageWidth: 625,
  });

  return (
    <div className="layout">
      <div className="page-columns-scrolling-container" ref={scrollContainer}>
        <div
          className="page-columns-container"
          style={{ width: 625 * (stackedPages.length + 1) }}
        >
          <ContextProvider>
            {/* Render the stacked pages */}
            {stackedPages.map((page, i) => (
              <StackedPageWrapper
                PageIndexProvider={PageIndexProvider}
                i={i}
                key={page.slug}
                slug={page.slug}
                {...stackedPageStates[page.slug]}
              >
                <Page {...page} />
              </StackedPageWrapper>
            ))}
          </ContextProvider>
        </div>
      </div>
    </div>
  );
};

export default StackedLayout;
```

Somewhere in your stacked page, you can use

```js
import { useStackedPages, LinkToStacked } from "react-stacked-pages-hook";

const Component = () => {
  const [
    stackedPages,
    navigateToStackedPage,
    highlightStackedPage,
    stackedPageIndex,
  ] = useStackedPages();

  return null;
};

const AnotherComponent = () => {
  return (
    <LinkToStacked to={"/stacked-page"}>
      Magic link that will stack a page
    </LinkToStacked>
  );
};
```
