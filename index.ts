import { isNullOrUndef } from 'yatter';

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

export function kippa() {
  const events = new Map<string, Callback[]>();
  const waiting = new Map<string, unknown[][]>();
  const exclusiveNames = new Set<string>();

  const emitter = {
    on(name: string, cb: Callback, option?: EventOption) {
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
    off(name: string, cb: Callback) {
      if (!name || !cb) {
        return emitter;
      }
      const cbs = events.get(name);

      const index = cbs?.findIndex((handler) => handler === cb || handler.handler === cb);
      if (isNullOrUndef(index) || !~index) {
        return emitter;
      }
      cbs?.splice(index, 1);

      return emitter;
    },
    clear(name?: string, cb?: Callback) {
      if (!name) {
        events.clear();
      } else if (!cb) {
        events.delete(name);
      } else {
        emitter.off(name, cb);
      }
      return emitter;
    },
    emit(name: string, ...args: unknown[]) {
      return emitter.pub(name, { lazy: false }, ...args);
    },
    pub(name: string, op?: EmitOption, ...args: unknown[]) {
      const handlers = events.get(name);
      for (const cb of handlers?.slice() || []) {
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
    once(name: string, cb: Callback) {
      return emitter.on(name, cb, { once: true });
    },
  };

  return emitter;
}

export const emitter = kippa;

export default emitter();
