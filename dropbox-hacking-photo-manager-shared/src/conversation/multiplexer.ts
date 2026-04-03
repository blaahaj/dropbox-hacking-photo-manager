import { generateId2 } from "./id.js";
import type { Connectable, MessageRouter } from "./types.js";

export type IDHolder = {
  readonly id: string;
};

export type WrappedPayload<T> =
  | { readonly tag: "open" }
  | { readonly tag: "message"; readonly message: T }
  | { readonly tag: "close" };

/**
 * Given a Connectable which is capable of transporting the necessary messages,
 * connect once, and then provide a Connectable which layers everything over
 * that one connection.
 *
 * @param base
 * @param listenerCallback
 * @returns
 */
export const multiplexer = <I, O>(
  base: Connectable<IDHolder & WrappedPayload<I>, IDHolder & WrappedPayload<O>>,
  listenerCallback: (handler: Connectable<I, O>) => void,
): Connectable<I, O> => {
  const multiplexerId = generateId2("multiplexer2");
  const receiversById: Map<string, MessageRouter<I>> = new Map();
  let mx = { id: "[placeholder]" } as Connectable<I, O>;

  const baseReceiverId = generateId2("multiplexer2:rx");

  const baseReader: MessageRouter<IDHolder & WrappedPayload<I>> = {
    push: (mxControlMessage) => {
      const { id, tag } = mxControlMessage;

      if (tag === "open") {
        if (receiversById.has(id)) {
          throw new Error(
            `Multiplexer ${multiplexerId} already has conversation ${id}`,
          );
        } else {
          const listenerId = generateId2("multiplexer:listener");
          const listener: Connectable<I, O> = {
            connect: (incomingReceiver) => {
              if (receiversById.has(id)) {
                throw new Error(
                  `Multiplexer ${multiplexerId} already has conversation ${id}`,
                );
              }

              receiversById.set(mxControlMessage.id, incomingReceiver);
              // console.debug(
              //   `mx accept(${listenerId}) -> R=${incomingReceiver.id} S=${id} (count=${receiversById.size})`,
              // );

              const incomingSender: MessageRouter<O> = {
                push: (message) =>
                  baseSender.push({
                    tag: "message",
                    id,
                    message,
                  }),
                end: () => {
                  receiversById.delete(id);
                  baseSender.push({
                    tag: "close",
                    id,
                  });
                  incomingReceiver.end();
                  // console.debug(
                  //   `${multiplexerId} ${id} closed (count=${receiversById.size})`,
                  // );
                },
                id: id,
              };

              return incomingSender;
            },
            id: listenerId,
          };

          // console.debug(`mx listener ${id} -> ${listenerId}`);
          listenerCallback(listener);
        }
      } else if (tag === "message") {
        const receiver = receiversById.get(mxControlMessage.id);

        if (receiver) {
          receiver.push(mxControlMessage.message);
        } else {
          console.error("message for non-open conversation", id);
        }
      } else if (tag === "close") {
        const receiver = receiversById.get(id);

        if (receiver) {
          receiversById.delete(id);
          receiver.end();
          // console.debug(
          //   `${multiplexerId} ${id} closed (count=${receiversById.size})`,
          // );
        } else {
          console.error("close of non-open conversation", id);
        }
      }
    },

    end: () => {
      for (const [id, receiver] of receiversById.entries()) {
        console.debug(
          `${multiplexerId} mx-close, sending a receive-close for ${id}`,
        );

        receiver.end();
      }

      receiversById.clear();
    },

    id: baseReceiverId,
  };

  const baseSender = base.connect(baseReader);

  mx = {
    connect: (outgoingReceiver) => {
      const id = generateId2("multiplexer:connect");
      if (receiversById.has(id)) throw new Error(`id conflict`);

      receiversById.set(id, outgoingReceiver);
      baseSender.push({ id, tag: "open" });

      // console.debug(
      //   `connect(${id}) -> R=${outgoingReceiver.id} S=${id} (count=${receiversById.size})`,
      // );

      return {
        push: (message) => baseSender.push({ id, tag: "message", message }),
        end: () => {
          receiversById.delete(id);
          console.debug(
            `${multiplexerId} ${id} closed (count=${receiversById.size})`,
          );
          baseSender.push({ id, tag: "close" });
          outgoingReceiver.end();
        },
        id: id,
      };
    },
    id: multiplexerId,
  };

  console.debug(
    `multiplexer(${base.id}) -> ${multiplexerId} BR=${baseReceiverId} BS=${baseSender.id}`,
  );

  return mx;
};
