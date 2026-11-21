import { Welcome } from "../welcome/welcome";

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
