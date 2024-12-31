import { isNullOrUndef } from 'yatter';

interface EmitOption {
  lazy?: boolean;
}

interface Callback {
  (...args: unknown[]): unknown;
  handler?: (...args: unknown[]) => unknown;
}

export function spiv() {
  const events = new Map<string, Callback[]>();
  const waiting = new Map<string, unknown[][]>();

  const emitter = {
    on(name: string, cb: Callback) {
      if (!name || !cb) {
        return emitter;
      }
      let cbs = events.get(name);
      if (!cbs) {
        cbs = [];
        events.set(name, cbs);
      }
      cbs.push(cb);
      for (const arg of waiting.get(name) || []) {
        cb(...arg);
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
      return emitter.send(name, { lazy: false }, ...args);
    },
    send(name: string, op?: EmitOption, ...args: unknown[]) {
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
      const wrapped: Callback = (...args) => {
        emitter.off(name, wrapped);
        cb(...args);
      };
      wrapped.handler = cb;
      emitter.on(name, wrapped);
      return emitter;
    },
  };

  return emitter;
}

export const emitter = spiv;

export default emitter();
