import { useState, useEffect } from 'react';
import { SlimStateInstance } from "./index.js";

export const useSlimState = (key: string, initialState: any = {}) => {
    // We get the initial setup from createStore.
    const [storeValue, returnFn, destroyFn] = SlimStateInstance.createStore(key, initialState);
    const [state, setState] = useState(storeValue);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            setState(customEvent.detail);
        };
        // Listen to changes on this key
        SlimStateInstance.target.addEventListener(key, handler);
        
        return () => {
            SlimStateInstance.target.removeEventListener(key, handler);
            if (typeof destroyFn === 'function') {
                destroyFn(key);
            }
        };
    }, [key, destroyFn]);

    return [state, returnFn];
}
export default useSlimState;
