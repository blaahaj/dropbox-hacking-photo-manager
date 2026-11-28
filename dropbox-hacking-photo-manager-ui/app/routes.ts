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
      index("routes/days/list/index.tsx"),
      route(":date", "routes/days/single/index.tsx"),
    ]),
    route("device-time", "routes/device-time/index.tsx"),
    route("exif-explorer", "routes/exif-explorer/index.tsx"),
    route("search", "routes/search/limited/index.tsx"),
    route("search/experiment", "routes/search/experiment/index.tsx"),
    route("stats", "routes/stats/index.tsx"),
    route("tags", "routes/tags/index.tsx"),
    route("video", "routes/video/index.tsx"),
    route(
      "mediainfo-explorer/:streamKind",
      "routes/mediainfo-explorer/index.tsx",
    ),
    route("kloakdæksler", "routes/kloakdæksler/page.tsx"),
  ]),
] satisfies RouteConfig;
