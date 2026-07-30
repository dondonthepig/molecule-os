"use client";

import * as React from "react";

function subscribe() {
  return () => {};
}

/** True only after the client has hydrated — avoids SSR/client markup mismatches. */
export function useHasMounted() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
