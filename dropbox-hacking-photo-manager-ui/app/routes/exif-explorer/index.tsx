// import type { Route } from "./+types/home";

export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM-RR EXIF Explorer" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

import page from "./page";

export default page;
