# Kippa
Kippa is an event emitter. 

# Install
```bash
$ npm install kippa --save
```
or

```bash
$ pnpm add kippa
```

Then you can use it via ESM, CJS and UMD

```js
// ESM
import {emitter, kippa} from 'kippa';

// CommonJS
const {emitter, kippa} = require('kippa');

```
UMD is available at `window.kippa`

```html
<script src="https://unpkg.com/kippa/dist/kippa.min.js"></script>
``` 


# Usage
```js 
import { emitter } from 'kippa';  // emitter is a global instance

// subscribe an event
emitter.on('event', console.log);

// fire an event
emitter.emit('event', 'hello world');

// subscribe an event only once
emitter.once('event', console.log);
// or
emitter.on('event', console.log, { once: true });


// unsubscribe an event
emitter.off('event', console.log);

```


# API

The named export `emitter` is a global instance. The named export `kippa` is a factory function, you can call it to create a new instance
```js
import { emitter, kippa } from 'kippa';
// emitter is a global instance
const emitter1 = kippa();
// emitter1 is a new instance
```

## on
Registers a callback function for the specified event.
```ts
on(name: EventKey, cb: Callback, option?: EventOption)
```
You can use any type as the event name, but I recommend you use a string;

EventOption supports two properties, once and exclusive. 

- The `once` property means that the event will only be triggered once.

- The `exclusive` property means that the event will only be registerd once, and repeated registration will be ignored. If an event is registered as `exclusive` for the first time, the previously registered callback function with the same name will be forced to clear, and this name will be permanently marked as `exclusive`, which cannot be changed even if `off` or `clear` is called to unsubscribe. At the same time, subsequent registration will be ignored.

## once
```ts
once(name: EventKey, cb: Callback)
```
This is a shorthand for `on(name, cb, { once: true })`

## off
```ts
off(name: EventKey, cb: Callback)
```
Removes a callback function for the sepcified event. If the event or callback function is missing, nothing will change. This is to prevent you from accidently clearing all callback functions.

## clear
```ts
clear(name?: EventKey, cb?: Callback)
```
similar to `off`, but it will clear all callback functions for the specified event, or all events if no event is specified.


## emit
```ts
emit(name: EventKey, ...args: unknown[])
```
Call all callback functions for the specified event. If you have registered * event before, the will also be called.

> You can not directly trigger an event named '*'

## pub
```ts
pub(name: EventKey, op?: EmitOption, ...args: unknown[])
```
An Enhanced version of `emit`. The second parameter currently only supports a property called lazy. If the `lazy` property is true, it means that if there is no callback function registered for the event, the event will be cached and will be triggered immediately when the callback function is registered for the event next time.
