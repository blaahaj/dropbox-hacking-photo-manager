// import type { Route } from "./+types/home";

export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM-RR List of Days" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

import page from "./list/page";
export default page;
