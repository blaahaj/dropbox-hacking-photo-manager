// import type { Connectable } from "./types.js";

// export const join = <A, B>(
//   readsAWritesB: Connectable<A, B>,
//   readsBWritesA: Connectable<B, A>,
// ) => {
//   const readA = {
//     push: (message: A) => writeA.push(message),
//     end: () => writeA.end(),
//     id: `[unused code]`,
//   };

//   const readB = {
//     push: (message: B) => writeB.push(message),
//     end: () => writeB.end(),
//     id: `[unused code]`,
//   };

//   const writeA = readsBWritesA.connect(readB);
//   const writeB = readsAWritesB.connect(readA);
// };
