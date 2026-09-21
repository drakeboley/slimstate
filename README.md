# slimstate
## Ultra-light State Management 

This is a very small, slimdriven barebones state management library. Very flexible, not many guardrails. 

Features:
- Extremely small and performant
- Minimally abstracted
- Simple API
- Very flexible
- Event driven
- Microtasks
- No dependencies (except TypeScript for compiling, and Angular for the optional Angular service)
- Framework agnostic
- React support
- Angular support
- Web Worker mode support
- Effect Sidechaining
- Optional Reducers
- Can use the SlimStateEventTarget as an event bus between components (useful in React)

## How To Install

```
npm install slimstate
```

Demos for integrating this module with React, Angular, and Web Components are contained in the ./demo folder.

## How To Use (Basic)

```javascript
import { SlimStateInstance } from "slimstate";

SlimStateInstance.createStore('storeKey', {
  prop: 'value',
  prop2: 'value
})
// set values
SlimStateInstance.set('storeKey', {
  prop: 'newValue
})
//get values
SlimStateInstance.get('storeKey')

//sidechaining
SlimStateInstance.sideChainEffect('storeKey', (value) => {
  console.log(value.prop)
})

//reducer
SlimStateInstance.reduce('storeKey', (value) => {
  return value.prop
})
```

## Worker Mode

```javascript
import { CreateSlimStateWorker, SlimStateEventTarget } from "slimstate";

const SlimState = CreateSlimStateWorker()
SlimState.createStore('storeKey', {
  prop: 'value',
  prop2: 'value
})
// set values
SlimStateEventTarget.addEventListener('set-storeKey', (value) => {
  //can do things with the value after setting here
  return value
})
SlimState.set('storeKey', {
  prop: 'newValue
})
//get values
SlimStateEventTarget.addEventListener('get-storeKey', (value) => {
  //can do things with the value after getting here
  return value
})
SlimState.get('storeKey')
//sidechaining
SlimState.sideChainEffect('storeKey', (value) => {
  console.log(value.prop)
})
//reducer
SlimStateEventTarget.addEventListener('reduce-storeKey', (value) => {
  //can do things with the value after setting here
  return value
})
SlimState.reduce('storeKey', (value) => {
  return value.prop
})
```




