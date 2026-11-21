export type PredicateGroup<T, U extends T> =
  | { truth: false; items: T[] }
  | { truth: true; items: U[] };

export const groupByPredicate = <T, U extends T>(
  items: Iterable<T>,
  fn: (item: T) => item is U,
): PredicateGroup<T, U>[] => {
  const groups: PredicateGroup<T, U>[] = [];
  let currentGroup: PredicateGroup<T, U> | undefined = undefined;

  for (const c of items) {
    if (fn(c)) {
      if (currentGroup && currentGroup.truth) {
        currentGroup.items.push(c);
      } else {
        groups.push(
          (currentGroup = {
            truth: true,
            items: [c],
          }),
        );
      }
    } else {
      if (currentGroup && !currentGroup.truth) {
        currentGroup.items.push(c);
      } else {
        groups.push(
          (currentGroup = {
            truth: false,
            items: [c],
          }),
        );
      }
    }
  }

  return groups;
};
