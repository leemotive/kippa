interface EmitOption {
  lazy?: boolean;
}
interface EventOption {
  once?: boolean;
  exclusive?: boolean;
}

interface Callback {
  (...args: unknown[]): unknown;
  handler?: (...args: unknown[]) => unknown;
}

type EventKey = unknown;

export function kippa() {
  const events = new Map<EventKey, Callback[]>();
  const waiting = new Map<EventKey, unknown[][]>();
  const exclusiveNames = new Set<EventKey>();

  const emitter = {
    on(name: EventKey, cb: Callback, option?: EventOption) {
      if (!name || !cb) {
        return emitter;
      }

      let wrapped = cb;
      if (option?.once) {
        wrapped = (...args: unknown[]) => {
          emitter.off(name, wrapped);
          cb(...args);
        };
        wrapped.handler = cb;
      }

      if (option?.exclusive) {
        exclusiveNames.add(name);
      }

      let cbs = events.get(name);
      if (!cbs) {
        cbs = [];
        events.set(name, cbs);
      }
      if (!cbs.length || !exclusiveNames.has(name)) {
        cbs.push(wrapped);
      }

      const waitingQueue = waiting.get(name) || [];
      waiting.delete(name);
      for (const arg of waitingQueue) {
        wrapped(...arg);
      }
      return emitter;
    },
    off(name: EventKey, cb: Callback) {
      if (!name || !cb) {
        return emitter;
      }
      const cbs = events.get(name);

      const index = cbs?.findIndex((handler) => handler === cb || handler.handler === cb) ?? -1;
      if (!~index) {
        return emitter;
      }
      cbs?.splice(index, 1);

      return emitter;
    },
    clear(name?: EventKey, cb?: Callback) {
      if (!name) {
        events.clear();
      } else if (!cb) {
        events.delete(name);
      } else {
        emitter.off(name, cb);
      }
      return emitter;
    },
    emit(name: EventKey, ...args: unknown[]) {
      return emitter.pub(name, { lazy: false }, ...args);
    },
    pub(name: EventKey, op?: EmitOption, ...args: unknown[]) {
      if (name === '*') {
        return emitter;
      }
      const handlers = events.get(name) ?? [];
      const allHandlers = events.get('*') ?? [];

      for (const cb of [...handlers, ...allHandlers]) {
        try {
          cb(...args);
        } catch (e) {
          console.error(e);
        }
      }
      if (!handlers?.length && op?.lazy) {
        let argQueue = waiting.get(name);
        if (!argQueue) {
          argQueue = [];
          waiting.set(name, argQueue);
        }
        argQueue.push(args);
      }

      return emitter;
    },
    once(name: EventKey, cb: Callback) {
      return emitter.on(name, cb, { once: true });
    },
  };

  return emitter;
}

export const emitter = kippa;

export default emitter();
