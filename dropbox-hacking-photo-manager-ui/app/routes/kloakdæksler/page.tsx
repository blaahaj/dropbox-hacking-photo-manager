import Navigation from "@components/Navigation";
import { useId, useState } from "react";

import { contentHashes } from "./data";
import style from "./page.module.css";
import Single from "./single";

export default function Page() {
  const hashes = contentHashes();

  const [clip, setClip] = useState(false);
  const checkId = useId();

  const [filter, setFilter] = useState("");
  const filterId = useId();

  return (
    <>
      <Navigation />

      <div style={{ margin: "1em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2em",
            alignItems: "baseline",
          }}
        >
          <h1 style={{ marginBlockEnd: "1em" }}>
            The Kloakdæksler Project, it lives!
          </h1>
          <span>
            <input
              id={checkId}
              type="checkbox"
              checked={clip}
              onChange={(e) => setClip(e.target.checked)}
            />{" "}
            <label htmlFor={checkId}>Clip</label>
          </span>
          <span>
            <label htmlFor={filterId}>Filter:</label>{" "}
            <input
              id={filterId}
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "20em", border: "2px inset #888" }}
            />
          </span>
        </div>

        <div className={style.imageList}>
          {hashes.map((contentHash) => (
            <Single
              key={contentHash}
              contentHash={contentHash}
              clip={clip}
              filter={filter}
            />
          ))}
        </div>
      </div>
    </>
  );
}
