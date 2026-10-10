import { SlimState } from "./slimstate.js";
import { SlimStateService } from "./slimStateService.js";
import { useSlimState } from "./useSlimState.js";

export const instance = new SlimState();
export const SlimStateEventTarget = instance.target;

export const CreateSlimStateWorker = () => {
    const worker = new Worker(new URL("worker.js", import.meta.url));
    worker.onmessage = function(event) {
        const newEvent = new CustomEvent(event.data.method + '-' + event.data.key, { detail: event.data.value });
        SlimStateEventTarget.dispatchEvent(newEvent);
    };
    return {
        createStore: (key: string, value: object) => worker.postMessage({
            method: 'create',
            key,
            value
        }),
        deleteStore: (key: string) => worker.postMessage({
            method: 'delete',
            key
        }),
        get: (key: string) => worker.postMessage({
            method: 'get',
            key
        }),
        set: (key: string, value: object) => worker.postMessage({
            method: 'set',
            key,
            value
        }),
        sideChainEffect: (key: string, effect: (value: any) => void) => {
            SlimStateEventTarget.addEventListener('set-' + key, (e: Event) => effect((e as CustomEvent).detail));
        },
        reduce: (key: string, reducer: Function) => {
            SlimStateEventTarget.addEventListener('get-' + key, (e: Event) => {
                const value = (e as CustomEvent).detail;
                const newEvent = new CustomEvent('reduce-' + key, { detail: reducer(value) });
                SlimStateEventTarget.dispatchEvent(newEvent);
            });
            worker.postMessage({
                method: 'get',
                key
            });
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
};
