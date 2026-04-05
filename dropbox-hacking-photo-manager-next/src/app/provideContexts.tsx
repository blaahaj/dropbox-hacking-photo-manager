"use client";

import { DefaultMultiplexerProvider } from "@/app/_hooks/useMultiplexer";
import type { Multiplexer } from "@hooks/useMultiplexer/context";
import { DefaultThumbnailProvider } from "@hooks/useThumbnail";
import { useMemo } from "react";

export default function ProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accepter = useMemo(
    () => (accept: Multiplexer) => {
      const w = accept.connect({
        push: (m) => {
          console.log(`The server connected to me and said:`, m);
          w.push(`Thank you for saying ${m as string}`);
        },
        end: () => {},
        id: `[unused code]`,
      });
    },
    [],
  );

  return (
    <DefaultMultiplexerProvider accepter={accepter}>
      <DefaultThumbnailProvider>{children}</DefaultThumbnailProvider>
    </DefaultMultiplexerProvider>
  );
}
