import type { Connectable, MessageRouter } from "./types.js";

/**
 * Spy on (console.debug) a MessageRouter
 *
 * @param base the MessageRouter to spy on
 * @returns a MessageRouter which performs the spying
 */
export const spyOnMessageRouter = <T>(
  base: MessageRouter<T>,
): MessageRouter<T> => {
  let messageCount = 0;

  const wrapped: MessageRouter<T> = {
    push: (message) => {
      ++messageCount;
      console.debug(`${wrapped.id} message (count: ${messageCount})`);
      base.push(message);
    },
    end: () => {
      console.debug(`${wrapped.id} close`);
      base.end();
    },
    id: `<spyOnMessageRouter ${base.id}>`,
  };

  return wrapped;
};

/**
 * Spy on (console.debug) a Connectable.
 *
 * Whenever `.connect()` is called, both the sending and the receiving MessageRouters
 * will by spied on. See `spyOnMessageRouter`.
 *
 * @param base the Connectable to spy on
 * @returns the Connectable which performs the spying
 */

export const spyOnConnectable = <I, O>(
  base: Connectable<I, O>,
): Connectable<I, O> => {
  let connectionCount = 0;

  const wrapped: Connectable<I, O> = {
    connect: (receiver) => {
      ++connectionCount;
      const wrappedReceiver = spyOnMessageRouter(receiver);
      const wrappedSender = spyOnMessageRouter(base.connect(wrappedReceiver));
      console.debug(
        `${wrapped.id} connect [${wrappedReceiver.id}, ${wrappedSender.id}] (count: ${connectionCount})`,
      );
      return wrappedSender;
    },
    id: `<spyOnConnectable ${base.id}>`,
  };

  return wrapped;
};
