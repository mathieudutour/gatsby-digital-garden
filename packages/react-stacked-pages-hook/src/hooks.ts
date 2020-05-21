import {
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
import { StackedPagesContext, StackedPagesIndexContext } from "./contexts";

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

type ScrollState = {
  [slug: string]: { obstructed: boolean; overlay: boolean };
};

export function useStackedPagesProvider<T>({
  location,
  processPageQuery,
  firstPageSlug,
  pageWidth = 625,
}: {
  location: Location;
  processPageQuery?: (queryResult: any) => T | null;
  firstPageSlug?: string;
  pageWidth?: number;
}) {
  const [scroll, containerWidth, setRef, containerRef] = useScroll();
  const [stackedPages, setStackedPages] = useState<{ slug: string; data: T }[]>(
    []
  );
  const [stackedPageStates, setStackedPageStates] = useState<ScrollState>({});

  const stackedPagesSlugs = useMemo(() => {
    const res = qs.parse(location.search.replace(/^\?/, "")).stackedPages || [];
    if (typeof res === "string") {
      return [res];
    }
    return res;
  }, [location]);

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
        // filter out 404s
        data
          .map((x, i) => ({
            slug: stackedPagesSlugs[i],
            data: processPageQuery ? processPageQuery(x) : x,
          }))
          .filter((x) => x.data)
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

  useEffect(() => {
    const acc: ScrollState = firstPageSlug
      ? {
          [firstPageSlug]: {
            overlay: false,
            obstructed: scroll > pageWidth - obstructedOffset,
          },
        }
      : {};

    if (!containerRef.current) {
      setStackedPageStates(
        stackedPages.reduce((prev, x) => {
          prev[x.slug] = {
            overlay: true,
            obstructed: false,
          };
          return prev;
        }, acc)
      );
      return;
    }

    setStackedPageStates(
      stackedPages.reduce((prev, x, i) => {
        prev[x.slug] = {
          overlay:
            scroll > pageWidth * i - (40 * i - 1) ||
            scroll < pageWidth * (i - 1),
          obstructed:
            scroll > pageWidth * (i + 2) - obstructedOffset ||
            scroll + containerWidth < pageWidth * (i + 1) + obstructedOffset,
        };
        return prev;
      }, acc)
    );
  }, [stackedPages, containerRef, scroll, setStackedPageStates]);

  const navigateToStackedPage = useCallback(
    (to, index) => {
      let existingPage = stackedPages.findIndex((x) => x.slug === to);
      if (existingPage === -1) {
        if (to === firstPageSlug) {
          existingPage = 0;
        }
      } else {
        existingPage += 1;
      }
      if (existingPage !== -1 && containerRef && containerRef.current) {
        containerRef.current.scrollTo({
          top: 0,
          left: pageWidth * existingPage,
          behavior: "smooth",
        });
        return;
      }
      const search = qs.parse(window.location.search.replace(/^\?/, ""));
      search.stackedPages = stackedPages
        .slice(0, index)
        .map((x) => x.slug)
        .concat(to);
      navigate(
        `${window.location.pathname.replace(withPrefix(""), "")}?${qs.stringify(
          search
        )}`
      );
    },
    [stackedPages]
  );

  return [
    stackedPages,
    stackedPageStates,
    navigateToStackedPage,
    StackedPagesContext.Provider,
    StackedPagesIndexContext.Provider,
    setRef,
  ];
}

export function useStackedPages() {
  const { stackedPages, navigateToStackedPage } = useContext(
    StackedPagesContext
  );
  const index = useContext(StackedPagesIndexContext);

  const hookedNavigateToStackedPage = useCallback(
    (to: string) => navigateToStackedPage(to, index),
    [navigateToStackedPage, index]
  );
  return [stackedPages, hookedNavigateToStackedPage, index] as const;
}
