export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM MediaInfo Explorer" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

import page from "./page";
export default page;
