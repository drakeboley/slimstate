import { FeatherState } from "./featherstate.js"
import { FeatherStateService } from "./featherStateService.js";
import { useFeatherState } from "./useFeatherState.js"
export const instance = new FeatherState();
export const FeatherStateEventTarget = instance.target;
export const CreateFeatherStateWorker = () => {
    const worker = new Worker(new URL("worker.js", import.meta.url));
    worker.onmessage = function(event) {
        const newEvent = new Event(event.data.method + '-' + event.data.key, event.data.value)
        FeatherStateEventTarget.dispatchEvent(newEvent)
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
            FeatherStateEventTarget.addEventListener('set-' + key, effect as EventListenerOrEventListenerObject)
        },
        reduce: (key: string, reducer: Function) => {
            FeatherStateEventTarget.addEventListener(key, (value) => {
                const newEvent = new Event('reduce-' + key, reducer(value))
                FeatherStateEventTarget.dispatchEvent(newEvent)
            })
            worker.postMessage({
                method: 'get',
                key
            })
        }
    }
}
export const FeatherStateInstance = instance;
export default {
    FeatherStateInstance,
    FeatherStateEventTarget,
    // for web worker mode
    CreateFeatherStateWorker,
    // for angular
    FeatherStateService,
    // for react
    useFeatherState
}