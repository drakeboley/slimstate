import { EventState } from "./event-state.js"
import { EventStateService } from "./eventStateService.js";
import { useEventState } from "./useEventState.js"
export const instance = new EventState();
export const EventStateEventTarget = instance.target;
export const CreateEventStateWorker = () => {
    const worker = new Worker(new URL("worker.js", import.meta.url));
    worker.onmessage = function(event) {
        const newEvent = new Event(event.data.method + '-' + event.data.key, event.data.value)
        EventStateEventTarget.dispatchEvent(newEvent)
    };
    return {
        createStore: (key: string, value: object) => worker.postMessage({
            method: 'create',
            key,
            value
        }),
        deleteStore: (key: string, value: object) => worker.postMessage({
            method: 'delete',
            key,
            value
        }),
        get: (key: string) => worker.postMessage({
            method: 'get',
            key
        }),
        set: (key: string, value: object) => worker.postMessage({
            method: 'delete',
            key,
            value
        }),
        sideChainEffect: (key: string, effect: Function) => {
            EventStateEventTarget.addEventListener('set-' + key, effect as EventListenerOrEventListenerObject)
        },
        reduce: (key: string, reducer: Function) => {
            EventStateEventTarget.addEventListener(key, (value) => {
                const newEvent = new Event('reduce-' + key, reducer(value))
                EventStateEventTarget.dispatchEvent(newEvent)
            })
            worker.postMessage({
                method: 'get',
                key
            })
        }
    }
}
export const EventStateInstance = instance;
export default {
    EventStateInstance,
    EventStateEventTarget,
    // for web worker mode
    CreateEventStateWorker,
    // for angular
    EventStateService,
    // for react
    useEventState
}