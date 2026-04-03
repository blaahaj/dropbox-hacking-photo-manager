"use client";
import SamePageLink from "@/app/_components/samePageLink";
import * as React from "react";
import styles from "./styles.module.css";

const navigation = (): React.ReactElement | null => (
  <div className={styles.navigation}>
    <SamePageLink
      routeState={{ route: "route/next-gen/list-of-days/without-samples" }}
    >
      Days
    </SamePageLink>
    {" | "}
    <SamePageLink routeState={{ route: "route/next-gen/video" }}>
      Video
    </SamePageLink>
    {" | "}
    <SamePageLink routeState={{ route: "route/next-gen/tags" }}>
      Tags
    </SamePageLink>
    {" | "}
    <SamePageLink routeState={{ route: "route/next-gen/search" }}>
      Search
    </SamePageLink>
    {" ~ "}
    <SamePageLink routeState={{ route: "route/next-gen/basic-counts" }}>
      counts
    </SamePageLink>
    {" | "}
    <SamePageLink routeState={{ route: "route/next-gen/fsck" }}>
      fsck
    </SamePageLink>
    {" | "}
    <SamePageLink routeState={{ route: "route/next-gen/exif-explorer" }}>
      exif
    </SamePageLink>
    {" | "}
    <SamePageLink
      routeState={{
        route: "route/next-gen/mediainfo-explorer",
        streamKind: null,
      }}
    >
      mediainfo
    </SamePageLink>

    {" ~ "}

    <button
      onClick={() =>
        void document
          .body
          .requestFullscreen({ navigationUI: "show" })
      }
    >
      Full screen
    </button>
  </div>
);

export default navigation;
