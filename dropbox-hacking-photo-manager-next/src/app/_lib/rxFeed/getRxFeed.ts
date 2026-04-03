import generateId from "@/app/_lib/generateId";
import type {
  Connectable,
  ObservableUpdate,
} from "dropbox-hacking-photo-manager-shared";
import type {
  FeedMap,
  RequestTypeFor,
  ResponseTypeFor,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import type { JSONValue } from "next/dist/server/config-shared";
import { Observable } from "rxjs";

export const getRxFeed = <
  NAME extends keyof FeedMap,
  RES extends ResponseTypeFor<NAME>,
  REQ extends RequestTypeFor<NAME>,
>(
  request: REQ,
  io: Connectable<ObservableUpdate<RES, JSONValue>, REQ>,
): Observable<RES> =>
  new Observable<RES>((subscriber) => {
    const id = generateId("getRxFeed");
    console.debug(`getRxFeed(${request.type}, ${io.id}) -> ${id}`);

    const sender = io.connect({
      push: (m) => {
        if (m.tag === "next") subscriber.next(m.value);
        if (m.tag === "complete") subscriber.complete();
        if (m.tag === "error") subscriber.error(m.error);
      },
      end: () => subscriber.unsubscribe(),
      id,
    });

    sender.push(request);

    return () => {
      console.log(`getRxFeed [${id}] observer close`);
      sender.end();
    };
  });
