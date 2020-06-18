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
  useStackedPage,
  PageIndexProvider,
  StackedPagesProvider,
} from "react-stacked-pages-hook";

const PageContainer = ({ children, slug }) => {
  const [, { overlay, obstructed, highlighted }, i] = useStackedPage();

  return (
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
  );
};

// A wrapper component to render the content of a page when stacked
const StackedPageWrapper = ({ children, slug, i }) => (
  <PageIndexProvider value={i}>
    <PageContainer slug={slug}>{children}</PageContainer>
  </PageIndexProvider>
);

const StackedLayout = ({ data, location, slug }) => {
  // Use this callback to update what you want to stack.
  // `pageQuery` will be similar to the data prop you get in a Page component.
  // You can return `null` to filter out the page
  const processPageQuery = useCallback((pageQuery) => pageQuery, []);

  const [state, scrollContainer] = useStackedNotesProvider({
    firstPage: { data, slug },
    location,
    processPageQuery,
    pageWidth: 625,
  });

  return (
    <div className="layout">
      <div className="page-columns-scrolling-container" ref={scrollContainer}>
        <div
          className="page-columns-container"
          style={{ width: 625 * (state.stackedPages.length + 1) }}
        >
          <StackedPagesProvider value={state}>
            {/* Render the stacked pages */}
            {state.stackedPages.map((page, i) => (
              <StackedPageWrapper i={i} key={page.slug} slug={page.slug}>
                <Page {...page} />
              </StackedPageWrapper>
            ))}
          </StackedPagesProvider>
        </div>
      </div>
    </div>
  );
};

export default StackedLayout;
```

Somewhere in your stacked page, you can use

```js
import {
  useStackedPages,
  useStackedPage,
  LinkToStacked,
} from "react-stacked-pages-hook";

const Component = () => {
  const [
    stackedPages,
    stackedPageStates,
    hookedNavigateToStackedPage,
    highlightStackedPage,
  ] = useStackedPages();

  const [
    currentPage,
    currentPageState,
    pageIndex,
    navigateToStackedPage,
    highlightStackedPage,
  ] = useStackedPage();

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
