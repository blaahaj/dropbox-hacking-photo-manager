import useThumbnail from "@hooks/useThumbnail";
import type { ThumbnailLoaderRequest } from "@hooks/useThumbnailLoader/types";
import logRender from "@lib/logRender";
import type {
  NamedFile,
  PhotoDbEntry,
} from "dropbox-hacking-photo-manager-shared";
import { isPreviewable } from "dropbox-hacking-photo-manager-shared/fileTypes";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import styles from "./MaybeVisibleThumbnail.module.css";

// Normalise to [0, 360)
const mod360 = (n: number) => (n + 360 * Math.ceil(Math.abs(n) / 360)) % 360;

const MaybeVisibleThumbnail = ({
  namedFile,
  photo,
  visible,
  linkTo,
  thumbnailOpts,
}: {
  namedFile: NamedFile;
  photo: PhotoDbEntry;
  visible: boolean;
  linkTo: string;
  thumbnailOpts?: Partial<Omit<ThumbnailLoaderRequest, "rev">>;
}) => {
  const req: ThumbnailLoaderRequest = {
    rev: namedFile.rev,
    thumbnailSize: "w128h128",
    mode: "strict",
    format: "jpeg",
    ...thumbnailOpts,
  };

  const isThumbnailable = isPreviewable(namedFile.path_lower);
  const thumbnail = useThumbnail(req, isThumbnailable && visible);

  const shouldBlur = photo.tags?.some((t) => t === "nsfw");

  // console.log([namedFile.name, ext, isThumbnailable, visible, !!thumbnail]);

  const targetDegrees = photo.rotate ?? 0;

  const [transformRotationDegrees, setTransformRotationDegrees] = useState(
    photo.rotate ?? 0,
  );
  useEffect(() => {
    let rotationRequired = mod360(targetDegrees - transformRotationDegrees);
    if (rotationRequired > 180) rotationRequired -= 360;

    if (rotationRequired !== 0) {
      setTransformRotationDegrees((old) => old + rotationRequired);
    }
  }, [targetDegrees, transformRotationDegrees]);

  const applyRotation = useMemo(
    () => (add: number) =>
      void fetch(
        `http://localhost:4000/api/photo/content_hash/${namedFile.content_hash}`,
        {
          method: "PATCH",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...photo,
            rotate: mod360(targetDegrees + add) || undefined,
          }),
        },
      ),
    [namedFile.content_hash, photo],
  );

  return (
    <div className={styles.thumbnail} style={{ position: "relative" }}>
      <Link to={linkTo}>
        <div
          style={{
            minHeight: "128px",
            transform: `rotate(${transformRotationDegrees}deg)`,
            transitionProperty: "transform",
            transitionDuration: "0.3s",
          }}
        >
          <img
            style={{
              width: thumbnail ? undefined : "128px",
              height: thumbnail ? undefined : "128px",
              filter: shouldBlur ? "blur(8px)" : undefined,
            }}
            src={
              thumbnail
                ? `data:image/jpeg;base64,${thumbnail}`
                : `/placeholder.png`
            }
            alt={"thumbnail"}
          />
        </div>
      </Link>

      <button
        className={styles.rotate}
        style={{
          position: "absolute",
          top: 0,
          right: "0.2em",
          background: "transparent",
          border: "none",
          fontSize: "10pt",
          cursor: "pointer",
        }}
        onClick={(e) => applyRotation(e.altKey ? -90 : +90)}
      >
        ⤵️
      </button>
    </div>
  );
};

export default logRender(MaybeVisibleThumbnail, false);
