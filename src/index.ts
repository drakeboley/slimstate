import { SlimState } from "./slimstate.js";
import { SlimStateService } from "./slimStateService.js";
import { useSlimState } from "./useSlimState.js";

export const instance = new SlimState();
export const SlimStateEventTarget = instance.target;
export const SlimStateInstance = instance;

export const createStore = instance.createStore.bind(instance);
export const set = instance.set.bind(instance);
export const get = instance.get.bind(instance);
export const deleteStore = instance.deleteStore.bind(instance);
export const reduce = instance.reduce.bind(instance);
export const sideChainEffect = instance.sideChainEffect.bind(instance);

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
            // ARCH-03: Use once: true to avoid leaking listeners on repeated reduce calls
            SlimStateEventTarget.addEventListener(
                'get-' + key,
                (e: Event) => {
                    const value = (e as CustomEvent).detail;
                    const newEvent = new CustomEvent('reduce-' + key, { detail: reducer(value) });
                    SlimStateEventTarget.dispatchEvent(newEvent);
                },
                { once: true }
            );
            worker.postMessage({
                method: 'get',
                key
            });
        }
    };
};

export { SlimState, SlimStateService, useSlimState };

export default {
    SlimState,
    instance,
    SlimStateInstance,
    SlimStateEventTarget,
    createStore,
    set,
    get,
    deleteStore,
    reduce,
    sideChainEffect,
    CreateSlimStateWorker,
    SlimStateService,
    useSlimState
};
