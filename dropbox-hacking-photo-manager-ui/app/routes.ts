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
      index("routes/days/index.tsx"),
      route(":date", "routes/days/single.tsx"),
    ]),
    route("video", "routes/video/index.tsx"),
    ...prefix("tags", [
      index("routes/tags/index.tsx"),
      route(":tag", "routes/tags/single.tsx"),
    ]),
    route("search", "routes/search/limited/index.tsx"),
    route("search/experiment", "routes/search/experiment/index.tsx"),
    route("stats", "routes/stats/index.tsx"),
    route("exif-explorer", "routes/exif-explorer/index.tsx"),
    route(
      "mediainfo-explorer/:streamKind",
      "routes/mediainfo-explorer/index.tsx",
    ),
  ]),
] satisfies RouteConfig;
