import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
  useRef,
} from "react";
import { navigate, withPrefix } from "gatsby";
import qs from "querystring";
import throttle from "lodash.throttle";
import equal from "lodash.isequal";
import {
  StackedPagesContext,
  StackedPagesIndexContext,
  ScrollState,
} from "./contexts";

declare global {
  interface Window {
    // provided by Gatsby
    ___loader: {
      loadPage: (slug: string) => Promise<any>;
    };
  }
}

const throttleTime = 16;
const obstructedOffset = 120;

function useScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState(0);
  const [width, setWidth] = useState(0);

  const scrollObserver = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    setScroll(containerRef.current.scrollLeft);
    setWidth(containerRef.current.getBoundingClientRect().width);
  }, [setScroll, setWidth, containerRef]);

  const throttledScrollObserver = throttle(scrollObserver, throttleTime);

  const setRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      // When the ref is first set (after mounting)
      node.addEventListener("scroll", throttledScrollObserver);
      containerRef.current = node;
      window.addEventListener("resize", throttledScrollObserver);
      throttledScrollObserver(); // initialization
    } else if (containerRef.current) {
      // When unmounting
      containerRef.current.removeEventListener(
        "scroll",
        throttledScrollObserver
      );
      window.removeEventListener("resize", throttledScrollObserver);
    }
  }, []);

  return [scroll, width, setRef, containerRef] as const;
}

function getRoot<T>(
  firstPage?: { data: any; slug: string },
  processPageQuery?: (queryResult: any, slug: string) => T | null
): { slug: string; data: T }[] {
  return firstPage
    ? [
        processPageQuery
          ? {
              data: processPageQuery(firstPage.data, firstPage.slug),
              slug: firstPage.slug,
            }
          : firstPage,
      ]
    : [];
}

export function useStackedPagesProvider<T>({
  location,
  processPageQuery,
  firstPage,
  pageWidth = 625,
  obstructedPageWidth = 40,
}: {
  location: Location;
  processPageQuery?: (queryResult: any, slug: string) => T | null;
  firstPage?: { data: any; slug: string };
  pageWidth?: number;
  obstructedPageWidth?: number;
}) {
  const previousFirstPage = useRef(firstPage);
  const [scroll, containerWidth, setRef, containerRef] = useScroll();
  const [stackedPages, setStackedPages] = useState<{ slug: string; data: T }[]>(
    getRoot(firstPage, processPageQuery)
  );
  const [stackedPageStates, setStackedPageStates] = useState<ScrollState>(
    firstPage
      ? {
          [firstPage.slug]: {
            obstructed: false,
            highlighted: false,
            overlay: scroll > pageWidth - obstructedOffset,
            active: true,
          },
        }
      : {}
  );

  const stackedPagesSlugs = useMemo(() => {
    const res = qs.parse(location.search.replace(/^\?/, "")).stackedPages || [];
    if (typeof res === "string") {
      return [res];
    }
    return res;
  }, [location]);

  useEffect(() => {
    if (equal(firstPage, previousFirstPage.current)) {
      return;
    }
    setStackedPages((pages) => {
      return getRoot(firstPage, processPageQuery).concat(
        previousFirstPage.current ? pages.slice(1) : pages
      );
    });
    previousFirstPage.current = firstPage;
  }, [firstPage, processPageQuery, setStackedPages]);

  useEffect(() => {
    if (!window.___loader) {
      throw new Error(
        "`react-stacked-pages-hook` can only be used with Gatsby"
      );
    }

    Promise.all(
      // hook into the internals of Gatsby to dynamically fetch the notes
      stackedPagesSlugs.map((slug) => window.___loader.loadPage(slug))
    ).then((data) =>
      setStackedPages(
        getRoot(firstPage, processPageQuery).concat(
          // filter out 404s
          data
            .map((x, i) => ({
              slug: stackedPagesSlugs[i],
              data: processPageQuery
                ? processPageQuery(x.json.data, stackedPagesSlugs[i])
                : x,
            }))
            .filter((x) => x.data)
        )
      )
    );
  }, [stackedPagesSlugs]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        left: pageWidth * (stackedPages.length + 1),
        behavior: "smooth",
      });
    }
  }, [stackedPages, containerRef]);

  // on scroll or on new page
  useEffect(() => {
    const acc: ScrollState = {};

    if (!containerRef.current) {
      setStackedPageStates(
        stackedPages.reduce((prev, x, i, a) => {
          prev[x.slug] = {
            overlay: true,
            obstructed: false,
            highlighted: false,
            active: i === a.length - 1,
          };
          return prev;
        }, acc)
      );
      return;
    }

    setStackedPageStates(
      stackedPages.reduce((prev, x, i, a) => {
        prev[x.slug] = {
          highlighted: false,
          overlay:
            scroll >
              Math.max(
                pageWidth * (i - 1) - (obstructedPageWidth * i - 2),
                0
              ) || scroll < Math.max(0, pageWidth * (i - 2)),
          obstructed:
            scroll >
              Math.max(
                pageWidth * (i + 1) -
                  obstructedOffset -
                  obstructedPageWidth * (i - 1),
                0
              ) || scroll + containerWidth < pageWidth * i + obstructedOffset,
          active: i === a.length - 1,
        };
        return prev;
      }, acc)
    );
  }, [stackedPages, containerRef, scroll, setStackedPageStates]);

  const navigateToStackedPage = useCallback(
    (to: string, index: number = 0) => {
      const existingPage = stackedPages.findIndex((x) => x.slug === to);
      if (existingPage !== -1 && containerRef && containerRef.current) {
        setStackedPageStates((stackedPageStates) => {
          if (!stackedPageStates[to]) {
            return stackedPageStates;
          }
          return Object.keys(stackedPageStates).reduce((prev, slug) => {
            prev[slug] = {
              ...stackedPageStates[slug],
              highlighted: false,
              active: slug === to,
            };
            return prev;
          }, {} as ScrollState);
        });
        containerRef.current.scrollTo({
          top: 0,
          left:
            pageWidth * existingPage - (obstructedPageWidth * existingPage - 1),
          behavior: "smooth",
        });
        return;
      }
      const search = qs.parse(window.location.search.replace(/^\?/, ""));
      search.stackedPages = stackedPages
        .slice(1, index + 1)
        .map((x) => x.slug)
        .concat(to);
      navigate(
        `${window.location.pathname.replace(
          withPrefix("/"),
          "/"
        )}?${qs.stringify(search)}`.replace(/^\/\//, "/")
      );
    },
    [stackedPages, setStackedPageStates]
  );

  const highlightStackedPage = useCallback(
    (slug: string, highlighted?: boolean) => {
      setStackedPageStates((stackedPageStates) => {
        if (!stackedPageStates[slug]) {
          return stackedPageStates;
        }
        return {
          ...stackedPageStates,
          [slug]: {
            ...stackedPageStates[slug],
            highlighted:
              typeof highlighted !== "undefined"
                ? highlighted
                : !stackedPageStates[slug].highlighted,
          },
        };
      });
    },
    [setStackedPageStates]
  );

  const contextValue = useMemo(
    () => ({
      stackedPages,
      navigateToStackedPage,
      highlightStackedPage,
      stackedPageStates,
    }),
    [
      stackedPages,
      navigateToStackedPage,
      highlightStackedPage,
      stackedPageStates,
    ]
  );

  return [contextValue, setRef];
}

export function useStackedPages() {
  const {
    stackedPages,
    stackedPageStates,
    navigateToStackedPage,
    highlightStackedPage,
  } = useContext(StackedPagesContext);
  const index = useContext(StackedPagesIndexContext);

  const hookedNavigateToStackedPage = useCallback(
    (to: string) => navigateToStackedPage(to, index),
    [navigateToStackedPage, index]
  );

  return [
    stackedPages,
    stackedPageStates,
    hookedNavigateToStackedPage,
    highlightStackedPage,
  ] as const;
}

export function useStackedPage() {
  const {
    stackedPages,
    stackedPageStates,
    navigateToStackedPage,
    highlightStackedPage,
  } = useContext(StackedPagesContext);
  const index = useContext(StackedPagesIndexContext);

  const hookedNavigateToStackedPage = useCallback(
    (to: string) => navigateToStackedPage(to, index),
    [navigateToStackedPage, index]
  );

  const currentPage = stackedPages[index];

  return [
    currentPage,
    currentPage ? stackedPageStates[currentPage.slug] : {},
    index,
    hookedNavigateToStackedPage,
    highlightStackedPage,
  ] as const;
}
