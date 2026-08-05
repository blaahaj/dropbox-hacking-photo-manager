import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useThumbnailLoader } from "./useThumbnailLoader";
import type { ThumbnailLoaderRequest } from "./useThumbnailLoader/types";

type R = string | null;

type S =
  | { readonly tag: "invisible-idle" }
  | { readonly tag: "visible-loading" }
  | { readonly tag: "visible-loaded"; readonly result: R }
  | {
      readonly tag: "invisible-expiring";
      readonly result: R;
    };

const EXPIRY_TIME = 10 * 1000;

const setImmediate = (fn: () => unknown) => setTimeout(fn, 1);

const useThumbnail = (req: ThumbnailLoaderRequest, visible: boolean) => {
  const loader = useThumbnailLoader();
  const [state, setState] = useState<S>({ tag: "invisible-idle" });
  const tag = state.tag;

  const startLoad = useMemo(
    () => () => {
      const reqBeingLoaded = req;
      loader.getThumbnail(req).then(
        (result) => {
          if (req === reqBeingLoaded) {
            setState({
              tag: "visible-loaded",
              result,
            });
          }
        },
        (error) => console.error(error),
      );
    },
    [req, loader],
  );

  // The visibility state transitions
  useEffect(() => {
    if (visible) {
      // Invisible states becoming visible
      if (tag === "invisible-idle") {
        setImmediate(() => {
          startLoad();
          setState({ tag: "visible-loading" });
        });
      } else if (tag === "invisible-expiring") {
        setImmediate(() =>
          setState((oldState) =>
            oldState.tag === "invisible-expiring"
              ? { tag: "visible-loaded", result: oldState.result }
              : oldState,
          ),
        );
      }
    } else {
      // Visible states becoming invisible
      if (tag === "visible-loading") {
        setImmediate(() => setState({ tag: "invisible-idle" }));
      } else if (tag === "visible-loaded") {
        setImmediate(() =>
          setState((oldState) =>
            oldState.tag === "visible-loaded"
              ? { tag: "invisible-expiring", result: oldState.result }
              : oldState,
          ),
        );
      }
    }
  }, [tag, visible, startLoad]);

  // Reset to idle if the rev changes
  // FIXME doesn't seem to work (or at least, it doesn't then cause startLoad, as was the plan)
  const oldReq = useDeferredValue(req);
  useEffect(() => {
    if (
      req.rev !== oldReq.rev ||
      req.thumbnailSize !== oldReq.thumbnailSize ||
      req.mode !== oldReq.mode ||
      req.format !== oldReq.format
    ) {
      setImmediate(() => setState({ tag: "invisible-idle" }));
    }
  });

  // Set / clear the timeout as we enter / leave "invisible-expiring"
  useEffect(() => {
    if (state.tag === "invisible-expiring") {
      const timer = setTimeout(
        () => setState({ tag: "invisible-idle" }),
        EXPIRY_TIME,
      );
      return () => clearTimeout(timer);
    }
  }, [state.tag]);

  // const [id] = useState(useId());
  // console.debug(
  //   `useThumbnail [${id}] ${rev} ${visible} ${state.tag} ${"result" in state ? typeof state.result : ""}`,
  // );

  return (state.tag === "visible-loaded" ||
    state.tag === "invisible-expiring") &&
    state.result !== null
    ? state.result
    : null;
};

export default useThumbnail;
