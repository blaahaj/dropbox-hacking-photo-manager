import { Welcome } from "../welcome/welcome";
// import type { Route } from "./+types/home";

export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM-RR" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
