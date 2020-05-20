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
import { useStackedPagesProvider } from "react-stacked-pages-hook";

// A wrapper component to render the content of a page when stacked
const StackedPageWrapper = ({ page, i }) => (
  <div className="page-container" style={{ left: 40 * (i + 1), right: -585 }}>
    <Page index={i + 1} {...page} />
  </div>
);

const StackedLayout = ({ children, location }) => {
  const scrollContainer = useRef();

  // Use this callback to update what you want to stack.
  // `pageQuery` will be similar to the props you get in a Page component.
  // You can return `null` to filter out the page
  const processPageQuery = useCallback((pageQuery) => pageQuery, []);

  const [
    stackedPages,
    navigateToStackedPage,
    ContextProvider,
    PageIndexProvider,
  ] = useStackedNotesProvider({
    firstPageSlug: "/About-these-notes",
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
          <ContextProvider value={{ stackedPages, navigateToStackedPage }}>
            {/* Render the first page */}
            <div className="page-container" style={{ left: 0, right: -585 }}>
              {children}
            </div>

            {/* Render the stacked pages */}
            {stackedPages.map((page, i) => (
              <PageIndexProvider value={i + 1} key={page.slug}>
                <StackedPageWrapper page={page.data} i={i} />
              </PageIndexProvider>
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
  const [stackedPages, navigateToStackedPage] = useStackedPages();

  return null;
};

// index is the
const AnotherComponent = () => {
  return (
    <LinkToStacked to={"/stacked-page"}>
      Magic link that will stack a page
    </LinkToStacked>
  );
};
```
