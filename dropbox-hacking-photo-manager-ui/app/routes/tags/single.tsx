// import type { Route } from "./+types/home";

import type { Route } from "./+types";

export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM-RR Single Tag" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

export default function SingleTag({ params }: Route.ComponentProps) {
  const p = params as { tag: string };
  console.dir({ p, tag: p.tag });
  return <h1>Single tag '{p.tag}'</h1>;
}
