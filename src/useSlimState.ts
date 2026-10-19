import { useState, useEffect, useRef } from 'react';
import { SlimStateInstance } from "./index.js";

export const useSlimState = <T extends object>(
    key: string,
    initialState: T = {} as T
): [T, (value: T) => void] => {
    const initializedRef = useRef(false);
    const returnFnRef = useRef<(value: T) => void>(() => {});

    if (!initializedRef.current) {
        if (!SlimStateInstance.state.has(key)) {
            const [, returnFn] = SlimStateInstance.createStore(key, initialState);
            returnFnRef.current = returnFn;
        } else {
            returnFnRef.current = (val: T) => SlimStateInstance.set(key, val);
        }
        initializedRef.current = true;
    }

    const [state, setState] = useState<T>(() => {
        const existing = SlimStateInstance.get<T>(key);
        return existing !== undefined ? existing : initialState;
    });

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<T>;
            setState(customEvent.detail);
        };
        SlimStateInstance.target.addEventListener(key, handler);

        return () => {
            SlimStateInstance.target.removeEventListener(key, handler);
        };
    }, [key]);

    return [state, returnFnRef.current];
};

export default useSlimState;
