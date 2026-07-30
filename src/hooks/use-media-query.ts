"use client";

import * as React from "react";

function getServerSnapshot() {
  return false;
}

/** Tracks whether a media query currently matches, reactively (SSR-safe). */
export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
