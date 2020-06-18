import React from "react";

export type ScrollState = {
  [slug: string]: {
    obstructed: boolean;
    overlay: boolean;
    highlighted: boolean;
  };
};

export const StackedPagesContext = React.createContext<{
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

export const StackedPagesIndexContext = React.createContext<number>(0);

export const StackedPagesProvider = StackedPagesContext.Provider;
export const PageIndexProvider = StackedPagesIndexContext.Provider;
