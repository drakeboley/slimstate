import { SlimState } from "./slimstate.js"
import { SlimStateService } from "./slimStateService.js";
import { useSlimState } from "./useSlimState.js"
export const instance = new SlimState();
export const SlimStateEventTarget = instance.target;
export const CreateSlimStateWorker = () => {
    const worker = new Worker(new URL("worker.js", import.meta.url));
    worker.onmessage = function(event) {
        const newEvent = new Event(event.data.method + '-' + event.data.key, event.data.value)
        SlimStateEventTarget.dispatchEvent(newEvent)
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
            SlimStateEventTarget.addEventListener('set-' + key, effect as EventListenerOrEventListenerObject)
        },
        reduce: (key: string, reducer: Function) => {
            SlimStateEventTarget.addEventListener(key, (value) => {
                const newEvent = new Event('reduce-' + key, reducer(value))
                SlimStateEventTarget.dispatchEvent(newEvent)
            })
            worker.postMessage({
                method: 'get',
                key
            })
        }
    }
}
export const SlimStateInstance = instance;
export default {
    SlimStateInstance,
    SlimStateEventTarget,
    // for web worker mode
    CreateSlimStateWorker,
    // for angular
    SlimStateService,
    // for react
    useSlimState
}