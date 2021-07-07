import { createContext } from "react";

export type ScrollState = {
  [slug: string]: {
    obstructed: boolean;
    overlay: boolean;
    highlighted: boolean;
    active: boolean;
  };
};

export const StackedPagesContext = createContext<{
  stackedPages: { slug: string; data: any }[];
  stackedPageStates: ScrollState;
  navigateToStackedPage: (to: string, index?: number) => void;
  highlightStackedPage: (slug: string, highlighted?: boolean) => void;
}>({
  stackedPages: [],
  stackedPageStates: {},
  navigateToStackedPage: () => {},
  highlightStackedPage: () => {},
});

export const StackedPagesIndexContext = createContext<number>(0);

export const StackedPagesProvider = StackedPagesContext.Provider;
export const PageIndexProvider = StackedPagesIndexContext.Provider;
