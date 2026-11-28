// import type { files } from "dropbox";

// import type { ShapeData } from "./data";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useId, useRef, useState } from "react";

import type { ShapeData } from "./data";
import style from "./imageIcon.module.css";

// type Props = {
//   sha: string;
//   entry: ImageFileGroup;
//   dbEntry: ShapeData;
//   withText: boolean;
//   preferredThumbnail: string;
//   desiredSize: number;
// };

export const ImageIcon = ({
  collection,
  previewSize,
  desiredSize,
  shapeData,
  withText,
  clip,
}: {
  collection: ContentHashCollection;
  previewSize: `w${number}h${number}`;
  desiredSize: number;
  shapeData: ShapeData | undefined;
  withText: boolean;
  clip: boolean;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState<{
    width?: number;
    height?: number;
  }>({});

  const shape = (shapeData?.tags ?? [])
    .find((tag) => tag.startsWith("shape:"))
    ?.replace("shape:", "");

  const imageUrl = `http://127.0.0.1:4000/image/rev/${collection.namedFiles[0].rev}/${previewSize}/strict/jpeg`;

  const image = (
    <img
      ref={imgRef}
      src={imageUrl}
      onLoad={() =>
        setImageSize({
          width: imgRef.current?.width,
          height: imgRef.current?.height,
        })
      }
    />
  );

  const clipperId = useId();

  if (
    !shapeData?.centerXRatio ||
    !shapeData?.centerYRatio ||
    !shapeData?.radiusRatio ||
    !imageSize.width ||
    !imageSize.height
  )
    return image;

  const safeNaturalWidth = imageSize.width;
  const safeNaturalHeight = imageSize.height;

  const smallerDimension =
    safeNaturalWidth < safeNaturalHeight ? safeNaturalWidth : safeNaturalHeight;

  const degreesRotation = 1 * (shapeData.rotateDegrees || 0);

  const tags: Set<string> = new Set(shapeData.tags);

  const scaleBy = desiredSize / smallerDimension;

  const scaledDesiredSize = desiredSize * shapeData.radiusRatio * 2;

  const isCircle = shape === "circle";
  const isSquare = shape === "square" || shape === "circleinsquare";
  const hasBox = !tags.has("multiple");

  return (
    <div className={style.item}>
      {withText && (
        <div className={style.texts}>
          <p className={style.imageText} title="Text shown in the design">
            {shapeData.text || <>&nbsp;</>}
          </p>
          <p className={style.imageTags} title="Tags">
            {(shapeData.tags || []).join(" ") || <>&nbsp;</>}
          </p>
        </div>
      )}

      <a href={`/content/${collection.contentHash}`}>
        <svg
          className={`${style.thumbnail} ${style.shapeSquare}`}
          width={desiredSize}
          height={desiredSize}
          viewBox={`-${desiredSize / 2} -${desiredSize / 2} ${desiredSize} ${desiredSize}`}
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <clipPath id={clipperId}>
              {isCircle && <circle cx="0" cy="0" r={scaledDesiredSize / 2} />}
              {isSquare && (
                <rect
                  x={-scaledDesiredSize / 2}
                  y={-scaledDesiredSize / 2}
                  width={scaledDesiredSize}
                  height={scaledDesiredSize}
                />
              )}
              {!isCircle && !isSquare && (
                <rect
                  x={-desiredSize / 2}
                  y={-desiredSize / 2}
                  width={desiredSize}
                  height={desiredSize}
                />
              )}
            </clipPath>
          </defs>

          <g transform={`rotate(${degreesRotation})`}>
            <g clipPath={hasBox && clip ? `url(#${clipperId})` : undefined}>
              <g
                transform={`scale(${scaleBy}) translate(-${safeNaturalWidth * shapeData.centerXRatio} -${safeNaturalHeight * shapeData.centerYRatio})`}
              >
                <image
                  href={imageUrl}
                  width={safeNaturalWidth}
                  height={safeNaturalHeight}
                  style={{ border: "1px dotted red" }}
                />
              </g>
            </g>
          </g>
        </svg>
      </a>
    </div>
  );
};
