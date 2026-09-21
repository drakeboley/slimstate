import React from 'react';
import { useSlimState } from '../../src/useSlimState.js';
import { SlimStateInstance } from '../../src/index.js';

const App = () => {
    // Create a store for counter if not already present
    let counter: {
        count: number
    }
    let setCounter: Function
    const SlimStateHook = useSlimState('counter', { count: 0 }) as [typeof counter, Function, Function];
    if (SlimStateHook.length <= 1) return null;
    [counter, setCounter] = SlimStateHook;

    // Side effect that logs changes to both counter and message stores
    React.useEffect(() => {
        const logHandler = (e: Event) => {
            console.log(`Event ${e.type} fired with detail`, e);
        };
        SlimStateInstance.sideChainEffect(['counter', 'message'], logHandler);
        return () => {
            // Cleanup listeners when component unmounts
            SlimStateInstance.deleteStore('counter');
        };
    }, []);

    const increment = () => setCounter({ count: counter.count + 1 });

    return (
        <div style={{ padding: '1rem' }}>
            <h2>SlimState Demo</h2>
            <p>Count: {counter.count}</p>
            <button onClick={increment}>Increment</button>{' '}
        </div>
    );
};

export default App;
