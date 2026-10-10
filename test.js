import { instance, SlimStateEventTarget } from './dist/index.js';
const [state, set, destroy] = instance.createStore('foo', {bar: 1});
setTimeout(() => {
  console.log(instance.get('foo'));
  set({bar: 2});
  setTimeout(() => {
    console.log(instance.get('foo'));
  }, 10);
}, 10);
