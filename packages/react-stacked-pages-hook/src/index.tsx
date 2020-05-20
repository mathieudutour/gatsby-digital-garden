import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import { navigate, withPrefix, GatsbyLinkProps, Link } from "gatsby";
import qs from "querystring";

declare global {
  interface Window {
    // provided by Gatsby
    ___loader: {
      loadPage: (slug: string) => Promise<any>;
    };
  }
}

export const StackedPagesContext = React.createContext<{
  stackedPages: { slug: string; data: any }[];
  navigateToStackedPage: (to: string, index?: number) => void;
}>({ stackedPages: [], navigateToStackedPage: () => {} });

export const StackedPagesIndexContext = React.createContext<number>(0);

export function useStackedPagesProvider<T>({
  location,
  processPageQuery,
  firstPageSlug,
  containerRef,
  pageWidth = 625,
}: {
  location: Location;
  processPageQuery?: (queryResult: any) => T | null;
  firstPageSlug?: string;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
  pageWidth?: number;
}) {
  const [stackedPages, setStackedPages] = useState<{ slug: string; data: T }[]>(
    []
  );

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
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        left: pageWidth * (stackedPages.length + 1),
        behavior: "smooth",
      });
    }
  }, [stackedPages, containerRef]);

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
    navigateToStackedPage,
    StackedPagesContext.Provider,
    StackedPagesIndexContext.Provider,
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
  return [stackedPages, hookedNavigateToStackedPage] as const;
}

export const LinkToStacked = React.forwardRef(
  ({ to, ...restProps }: GatsbyLinkProps<any>, ref) => {
    const [, navigateToStackedPage] = useStackedPages();
    const onClick = useCallback(
      (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        navigateToStackedPage(to);
      },
      [navigateToStackedPage, to]
    );
    // @ts-ignore
    return <Link {...restProps} to={to} ref={ref} onClick={onClick} />;
  }
);
