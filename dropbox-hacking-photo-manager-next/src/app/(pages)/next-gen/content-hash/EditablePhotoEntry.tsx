import EditableTextField from "@components/editableTextField";
import TagList from "@components/tags/TagList";
import logRender from "@lib/logRender";
import type { PhotoDbEntry } from "dropbox-hacking-photo-manager-shared";
import React, { useMemo } from "react";

const EditablePhotoEntry = ({
  contentHash,
  photoDbEntry,
}: {
  contentHash: string;
  photoDbEntry: PhotoDbEntry;
}) => {
  const onSaveDescription = useMemo(
    () => (newText: string) =>
      fetch(`http://localhost:4000/api/photo/content_hash/${contentHash}`, {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...(photoDbEntry ?? {}), description: newText }),
      }).then(() => {}),
    [contentHash, photoDbEntry],
  );

  const onSaveTags = useMemo(
    () => (newText: string) =>
      fetch(`http://localhost:4000/api/photo/content_hash/${contentHash}`, {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(photoDbEntry ?? {}),
          tags: newText.trim().replaceAll(/ /g, " ").split(" ").filter(Boolean),
        }),
      }).then(() => {}),
    [contentHash, photoDbEntry],
  );

  return (
    <div>
      <div>
        Description:{" "}
        <EditableTextField
          key={photoDbEntry.description ?? ""}
          value={photoDbEntry.description ?? ""}
          onSave={onSaveDescription}
        />
      </div>

      <div style={{ marginBlock: "1em" }}>
        Tags:{" "}
        <EditableTextField
          key={photoDbEntry.tags?.join(" ") ?? ""}
          value={photoDbEntry.tags?.join(" ") ?? ""}
          onSave={onSaveTags}
          renderInactive={({ value, placeholderText }) =>
            value === "" ? placeholderText : (
              <TagList
                data={(photoDbEntry?.tags ?? []).map((tag) => ({ tag }))}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default logRender(EditablePhotoEntry);
