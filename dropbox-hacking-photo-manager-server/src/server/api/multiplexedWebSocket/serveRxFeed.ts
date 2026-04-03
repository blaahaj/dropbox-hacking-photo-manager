import type { JSONValue } from "@blaahaj/json";
import type { ObservableUpdate } from "dropbox-hacking-photo-manager-shared";
import { Connectable, generateId2 } from "dropbox-hacking-photo-manager-shared";
import { Observable } from "rxjs";

export const serveRxFeed = <T>(
  observable: Observable<T>,
  io: Connectable<never, ObservableUpdate<T, JSONValue>>,
): void => {
  const id = generateId2("serveRxFeed");
  console.debug(`serveRxFeed(${io.id}) -> ${id}`);

  const sender = io.connect({
    push: () => sender.end(),
    end: () => subscription?.unsubscribe(),
    id: id,
  });

  const subscription = observable.subscribe({
    next: (value) => sender.push({ tag: "next", value }),
    complete: () => {
      sender.push({ tag: "complete" });
      sender.end();
    },
    error: (error) => {
      console.error(error);
      sender.push({ tag: "error", error });
      sender.end();
    },
  });
};
