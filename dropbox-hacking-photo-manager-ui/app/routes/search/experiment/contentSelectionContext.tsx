import { createContext, type PropsWithChildren, useContext } from "react";

export type T = {
  focusedContentHash: string | undefined;
};

const context = createContext<T | undefined>(undefined);

export const useContentSelection = () => useContext(context);

export const WithContentSelectionContext = (props: PropsWithChildren) => {
  const c: T = {
    focusedContentHash: undefined,
  };

  return <context.Provider value={c}>{props.children}</context.Provider>;
};
