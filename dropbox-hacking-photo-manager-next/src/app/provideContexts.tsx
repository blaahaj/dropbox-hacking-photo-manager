"use client";

import { useDefaultProvider as MultiplexerProvider } from "@/app/_hooks/useMultiplexer";
import type { Connectable } from "dropbox-hacking-photo-manager-shared";
import { useMemo } from "react";

export default function ProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accepter = useMemo(
    () => (accept: Connectable<unknown, unknown>) => {
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
    <MultiplexerProvider accepter={accepter}>{children}</MultiplexerProvider>
  );
}
