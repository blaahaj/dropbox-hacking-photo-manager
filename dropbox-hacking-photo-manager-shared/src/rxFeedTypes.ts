export type ObservableUpdate<T, E> =
  | { readonly tag: "next"; readonly value: T }
  | { readonly tag: "complete" }
  | { readonly tag: "error"; readonly error: E };
