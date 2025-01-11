import { kippa } from '../index';

test('on', () => {
  const emitter = kippa();

  const callback = jest.fn();
  emitter.emit('event', 2);

  emitter.on('event', callback);
  emitter.emit('event', 3);
  expect(callback).toHaveBeenCalledWith(3);
  emitter.emit('event', 4, 6);

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(4, 6);
});

test('lazy', () => {
  const emitter = kippa();

  const callback = jest.fn();
  emitter.pub('event', { lazy: true }, 3);
  expect(callback).toHaveBeenCalledTimes(0);

  emitter.on('event', callback);
  expect(callback).toHaveBeenCalledTimes(1);

  emitter.pub('event', { lazy: true }, 4);
  const callback2 = jest.fn();
  emitter.on('event', callback2);
  expect(callback2).toHaveBeenCalledTimes(0);
});

test('exclusive', () => {
  const emitter = kippa();
  const callback = jest.fn();
  const callback1 = jest.fn();
  emitter.on('event', callback, { exclusive: true });
  emitter.on('event', callback1);
  emitter.emit('event', 3);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback1).toHaveBeenCalledTimes(0);
});

test('once', () => {
  const emitter = kippa();
  const callback = jest.fn();
  emitter.on('event', callback, { once: true });
  emitter.emit('event', 3);
  expect(callback).toHaveBeenCalledTimes(1);
  emitter.emit('event', 3);
  expect(callback).toHaveBeenCalledTimes(1);

  const callback2 = jest.fn();
  emitter.once('event', callback2);
  emitter.emit('event', 3);
  expect(callback2).toHaveBeenCalledTimes(1);
  emitter.emit('event', 3);
  expect(callback2).toHaveBeenCalledTimes(1);
});

test('off', () => {
  const emitter = kippa();
  const callback = jest.fn();
  emitter.on('event', callback);
  emitter.emit('event', 3);
  expect(callback).toHaveBeenCalledTimes(1);
  emitter.off('event', callback);
  emitter.emit('event', 3);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('clear', () => {
  const emitter = kippa();
  const callback = jest.fn();
  emitter.on('event', callback);
  emitter.emit('event');
  expect(callback).toHaveBeenCalledTimes(1);

  const callback2 = jest.fn();
  emitter.on('event2', callback2);
  emitter.emit('event2');
  expect(callback2).toHaveBeenCalledTimes(1);

  emitter.clear('event');
  emitter.emit('event');
  emitter.emit('event2');
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback2).toHaveBeenCalledTimes(2);

  emitter.clear();
  emitter.emit('event2');
  expect(callback2).toHaveBeenCalledTimes(2);
});

test('all', () => {
  const emitter = kippa();
  const callback = jest.fn();
  emitter.on('*', callback);
  emitter.emit('event');
  emitter.emit('event2');
  emitter.emit('*');
  expect(callback).toHaveBeenCalledTimes(2);
});
