const plugins = process.env.NODE_ENV === "production" ? [] : ["postcss-d-ts"];
// process.env.NODE_ENV === "production"
//   ? [
//       "postcss-flexbugs-fixes",
//       [
//         "postcss-preset-env",
//         {
//           autoprefixer: {
//             flexbox: "no-2009",
//           },
//           stage: 3,
//           features: {
//             "custom-properties": false,
//           },
//         },
//       ],
//     ]
//   : [
//       // "postcss-d-ts"
//     ];

const config = { plugins } as const;
export default config;
