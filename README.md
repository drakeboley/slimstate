# ![FeatherState](/featherstate.png "FeatherState")
## Ultra-light State Management 

This is a very small, event-driven barebones state management library. Very flexible, not many guardrails. 

Features:
- Extremely small and performant
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

## How To Install

```
npm install featherstate
```

Demos for integrating this module with React, Angular, and Web Components are contained in the ./demo folder.

## How To Use (Basic)

```javascript
import { FeatherStateInstance } from "featherstate";

FeatherStateInstance.createStore('storeKey', {
  prop: 'value',
  prop2: 'value
})
// set values
FeatherStateInstance.set('storeKey', {
  prop: 'newValue
})
//get values
FeatherStateInstance.get('storeKey')

//sidechaining
FeatherStateInstance.sideChainEffect('storeKey', (value) => {
  console.log(value.prop)
})

//reducer
FeatherStateInstance.reduce('storeKey', (value) => {
  return value.prop
})
```

## Worker Mode

```javascript
import { CreateFeatherStateWorker, FeatherStateEventTarget } from "featherstate";

const FeatherState = CreateFeatherStateWorker()
FeatherState.createStore('storeKey', {
  prop: 'value',
  prop2: 'value
})
// set values
FeatherStateEventTarget.addEventListener('set-storeKey', (value) => {
  //can do things with the value after setting here
  return value
})
FeatherState.set('storeKey', {
  prop: 'newValue
})
//get values
FeatherStateEventTarget.addEventListener('get-storeKey', (value) => {
  //can do things with the value after getting here
  return value
})
FeatherState.get('storeKey')
//sidechaining
FeatherState.sideChainEffect('storeKey', (value) => {
  console.log(value.prop)
})
//reducer
FeatherStateEventTarget.addEventListener('reduce-storeKey', (value) => {
  //can do things with the value after setting here
  return value
})
FeatherState.reduce('storeKey', (value) => {
  return value.prop
})
```




