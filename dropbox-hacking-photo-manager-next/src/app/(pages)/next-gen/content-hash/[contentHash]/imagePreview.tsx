import logRender from "@lib/logRender";
import type {
  NamedFile,
  PhotoDbEntry,
} from "dropbox-hacking-photo-manager-shared";
import { useEffect, useMemo, useRef, useState } from "react";

// Normalise to [0, 360)
const mod360 = (n: number) => (n + 360 * Math.ceil(Math.abs(n) / 360)) % 360;

const ImagePreview = ({
  namedFile,
  photo,
}: {
  namedFile: NamedFile;
  photo: PhotoDbEntry;
}) => {
  const [previewWidthAndHeight, setPreviewWidthAndHeight] = useState<{
    width: number;
    height: number;
  }>();

  const theImage = useRef<HTMLImageElement>(null);
  const [transitionDuration, setTransitionDuration] = useState("0s");

  const shouldBlur = photo.tags?.some((t) => t === "nsfw");

  useEffect(() => {
    const img = theImage.current;
    if (!img) return;

    const readSize = (): boolean => {
      if (img.naturalWidth && img.naturalHeight) {
        setPreviewWidthAndHeight({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        return true;
      } else {
        return false;
      }
    };

    if (!readSize()) {
      const loadEvent = () => {
        if (readSize()) img.removeEventListener("load", loadEvent);
      };
      img.addEventListener("load", loadEvent);
    }
  }, []);

  const targetDegrees = photo.rotate ?? 0;

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
    [namedFile.content_hash, photo, targetDegrees],
  );

  const rotatedWidthAndHeight = previewWidthAndHeight
    ? (targetDegrees / 90) % 2
      ? {
          width: previewWidthAndHeight.height,
          height: previewWidthAndHeight.width,
        }
      : previewWidthAndHeight
    : undefined;

  return (
    <div
      style={{
        width: "670px",
        height: "670px",
        position: "relative",
        background: "black",
        padding: "10px",
      }}
    >
      <a
        style={{ display: "block" }}
        href={`http://localhost:4000/image/rev/${namedFile.rev}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            display: "block",
            position: "relative",
            top: "320px",
            left: "320px",
            boxSizing: "content-box",
            border: "5px solid white",
            transform:
              !previewWidthAndHeight || !rotatedWidthAndHeight
                ? undefined
                : `
              translate(-${previewWidthAndHeight.width / 2}px, -${previewWidthAndHeight.height / 2}px)
              rotate(${targetDegrees}deg)
              `,
            transitionProperty: "transform filter",
            transitionDuration,
            filter: shouldBlur ? "blur(20px)" : undefined,
          }}
          ref={theImage}
          src={`http://localhost:4000/image/rev/${namedFile.rev}/w640h480/bestfit/jpeg`}
          alt={"preview"}
          onLoad={() =>
            setTimeout(() => setTransitionDuration("0.3s"), 1000 /* HACK! */)
          }
        />
      </a>

      <button
        style={{
          position: "absolute",
          top: 0,
          left: "4px",
          background: "transparent",
          border: "none",
          fontSize: "20pt",
          transform: "rotate(-90deg)",
        }}
        onClick={(e) => void applyRotation(e.altKey ? -90 : +90)}
      >
        ⤵️
      </button>
    </div>
  );
};

export default logRender(ImagePreview);
