"use client";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, type CSSProperties } from "react";

const CopyButton = ({
  items,
  title,
  feedbackMillis,
  style,
}: {
  items: () => ClipboardItems | Promise<ClipboardItems>;
  title?: string;
  feedbackMillis?: number;
  style?: CSSProperties;
}) => {
  const [showCopied, setShowCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const doCopy = () =>
    Promise.resolve(items())
      .then((items) => navigator.clipboard.write(items))
      .then(() => {
        setShowCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setShowCopied(false);
          timerRef.current = null;
        }, feedbackMillis ?? 2000);
      })
      .catch(() => null);

  return (
    <span
      title={title}
      style={{
        cursor: "pointer",
        marginInlineStart: "0.5em",
        ...(style ?? {}),
      }}
      onClick={doCopy}
    >
      <FontAwesomeIcon icon={faCopy} />
      <span
        style={{
          marginInlineStart: "0.25em",
          visibility: showCopied ? "visible" : "hidden",
        }}
      >
        ✅
      </span>
    </span>
  );
};

export default CopyButton;
