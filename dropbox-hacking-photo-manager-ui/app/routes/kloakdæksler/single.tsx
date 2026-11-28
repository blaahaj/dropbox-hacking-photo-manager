import { useLatestValueFromServerFeed } from "~/_hooks/useLatestValueFromServerFeed";

import { lookup, type ShapeData } from "./data";
import { ImageIcon } from "./imageIcon";
import style from "./single.module.css";

const filterMatches = (filter: string, shapeData: ShapeData): boolean => {
  const f = filter.trim();
  if (f === "") return true;

  const parts = f.toLocaleLowerCase().split(/ +/g);
  const t = [shapeData.text ?? "", ...(shapeData.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

  return parts.every((part) => t.includes(part));
};

export default function Single({
  contentHash,
  clip,
  filter,
}: {
  clip: boolean;
  contentHash: string;
  filter: string;
}) {
  const collection = useLatestValueFromServerFeed({
    type: "rx.ng.content_hash",
    contentHash,
  });

  const r = lookup(contentHash);

  if (!filterMatches(filter, r?.shapeData ?? {})) return;

  return (
    <div className={style.item}>
      {collection?.namedFiles[0] && (
        <ImageIcon
          collection={collection}
          shapeData={r?.shapeData}
          withText={true}
          desiredSize={200}
          previewSize={"w256h256"}
          clip={clip}
        />
      )}
    </div>
  );
}
