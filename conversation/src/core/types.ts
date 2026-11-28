/**
 * Represents a half-duplex connection, capable of transferring messages of type T.
 * Given a MessageRouter, one can `.push(message)` as many times as required.
 * To signal the end of the messages, call `.end()`.
 *
 * Each MessageRouter is bound to the logic for how any pushed messages, and how
 * `.end()`, should be handled.
 */
export interface MessageRouter<T> {
  readonly push: (message: T) => void;
  readonly end: () => void;
  readonly id: string;
}

/**
 * Represents the ability to establish a full-duplex connection, capable
 * of receiving messages of type I, and sending messages of type O.
 *
 * To establish a connection, first build a MessageRouter specifying how
 * any incoming messages should be handled. Then pass this to `.connect()`,
 * which returns a MessageRouter allowing outgoing messages to be sent.
 */
export interface Connectable<I, O> {
  readonly connect: (receiver: MessageRouter<I>) => MessageRouter<O>;
  readonly id: string;
}
