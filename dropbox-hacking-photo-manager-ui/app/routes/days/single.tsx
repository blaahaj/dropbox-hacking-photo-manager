// import type { Route } from "./+types/home";

export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM-RR Single Day" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

import page from "./single/page";
export default page;
