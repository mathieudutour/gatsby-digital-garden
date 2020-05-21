import React from "react";

export const StackedPagesContext = React.createContext<{
  stackedPages: { slug: string; data: any }[];
  navigateToStackedPage: (to: string, index?: number) => void;
}>({ stackedPages: [], navigateToStackedPage: () => {} });

export const StackedPagesIndexContext = React.createContext<number>(0);
