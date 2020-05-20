import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import { navigate, withPrefix } from "gatsby";
import qs from "querystring";

export const StackedNotesContext = React.createContext({ stackedNotes: [] });

export function useStackedNotesProvider({
  location,
  pageToNote,
  indexNote,
  containerRef,
  noteWidth,
}) {
  const [stackedNotes, setStackedNotes] = useState([]);

  const stackedNotesSlugs = useMemo(() => {
    const res = qs.parse(location.search.replace(/^\?/, "")).stackedNotes || [];
    if (typeof res === "string") {
      return [res];
    }
    return res;
  }, [location]);

  useEffect(() => {
    Promise.all(
      // hook into the internals of Gatsby to dynamically fetch the notes
      stackedNotesSlugs.map((slug) => window.___loader.loadPage(slug))
    ).then((data) =>
      setStackedNotes(
        // filter out 404s
        data
          .map((x, i) => ({
            slug: stackedNotesSlugs[i],
            data: pageToNote ? pageToNote(x) : x,
          }))
          .filter((x) => x.data)
      )
    );
  }, [stackedNotesSlugs]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        left: noteWidth * (stackedNotes.length + 1),
        behavior: "smooth",
      });
    }
  }, [stackedNotes, containerRef]);

  const navigateToNote = useCallback(
    (to, index) => {
      let existingNote = stackedNotes.findIndex((x) => x.slug === to);
      if (existingNote === -1) {
        if (to === indexNote) {
          existingNote = 0;
        }
      } else {
        existingNote += 1;
      }
      if (existingNote !== -1 && containerRef.current) {
        containerRef.current.scrollTo({
          top: 0,
          left: noteWidth * existingNote,
          behavior: "smooth",
        });
        return;
      }
      const search = qs.parse(window.location.search.replace(/^\?/, ""));
      search.stackedNotes = stackedNotes
        .slice(0, index)
        .map((x) => x.slug)
        .concat(to);
      navigate(
        `${window.location.pathname.replace(withPrefix(""), "")}?${qs.stringify(
          search
        )}`
      );
    },
    [stackedNotes]
  );

  return [stackedNotes, navigateToNote, StackedNotesContext.Provider];
}

export function useStackedNotes() {
  const { stackedNotes, navigateToNote } = useContext(StackedNotesContext);
  return [stackedNotes, navigateToNote];
}
