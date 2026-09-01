import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layouts/with-feeds/index.tsx", [
    route("content/:contentHash", "routes/content/index.tsx"),
    ...prefix("days", [
<<<<<<< HEAD
      index("routes/days/index.tsx"),
      route(":date", "routes/days/single.tsx"),
    ]),
    route("video", "routes/video/index.tsx"),
    route("tags", "routes/tags/index.tsx"),
=======
      index("routes/days/list/index.tsx"),
      route(":date", "routes/days/single/index.tsx"),
    ]),
    route("exif-explorer", "routes/exif-explorer/index.tsx"),
>>>>>>> 760c7c5 (chore: rearrange days / day page files)
    route("search", "routes/search/limited/index.tsx"),
    route("search/experiment", "routes/search/experiment/index.tsx"),
    route("stats", "routes/stats/index.tsx"),
    route("tags", "routes/tags/index.tsx"),
    route("video", "routes/video/index.tsx"),
    route(
      "mediainfo-explorer/:streamKind",
      "routes/mediainfo-explorer/index.tsx",
    ),
  ]),
] satisfies RouteConfig;
