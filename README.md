# event-state
## Ultra-light State Management 

This is a very small, event-driven barebones state management library. Very flexible, not many guardrails. 

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
- Can use the EventStateEventTarget as an event bus between components (useful in React)

## How To Install

```
npm install event-state
```

Demos for integrating this module with React, Angular, and Web Components are contained in the ./demo folder.

## How To Use (Basic)

```javascript
import { EventStateInstance } from "event-state";

EventStateInstance.createStore('storeKey', {
  prop: 'value',
  prop2: 'value
})
// set values
EventStateInstance.set('storeKey', {
  prop: 'newValue
})
//get values
EventStateInstance.get('storeKey')

//sidechaining
EventStateInstance.sideChainEffect('storeKey', (value) => {
  console.log(value.prop)
})

//reducer
EventStateInstance.reduce('storeKey', (value) => {
  return value.prop
})
```

## Worker Mode

```javascript
import { CreateEventStateWorker, EventStateEventTarget } from "event-state";

const EventState = CreateEventStateWorker()
EventState.createStore('storeKey', {
  prop: 'value',
  prop2: 'value
})
// set values
EventStateEventTarget.addEventListener('set-storeKey', (value) => {
  //can do things with the value after setting here
  return value
})
EventState.set('storeKey', {
  prop: 'newValue
})
//get values
EventStateEventTarget.addEventListener('get-storeKey', (value) => {
  //can do things with the value after getting here
  return value
})
EventState.get('storeKey')
//sidechaining
EventState.sideChainEffect('storeKey', (value) => {
  console.log(value.prop)
})
//reducer
EventStateEventTarget.addEventListener('reduce-storeKey', (value) => {
  //can do things with the value after setting here
  return value
})
EventState.reduce('storeKey', (value) => {
  return value.prop
})
```




