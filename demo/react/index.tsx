import React from 'react';
import { useFeatherState } from '../../src/useFeatherState.js';
import { FeatherStateInstance } from '../../src/index.js';

// Demo component showing createStore, set, deleteStore and sideChainEffect
const App = () => {
    // Create a store for counter if not already present
    const FeatherStateHook = useFeatherState('counter', { count: 0 }) as [any, Function, Function];
    
    if (FeatherStateHook.length <= 1) return null;
    const [counter, setCounter] = FeatherStateHook;

    // Side effect that logs changes to both counter and message stores
    React.useEffect(() => {
        const logHandler = (e: Event) => {
            console.log(`Event ${e.type} fired with detail`, e);
        };
        FeatherStateInstance.sideChainEffect(['counter', 'message'], logHandler);
        return () => {
            // Cleanup listeners when component unmounts
            FeatherStateInstance.deleteStore('counter');
        };
    }, []);

    const increment = () => setCounter({ count: counter.count + 1 });

    return (
        <div style={{ padding: '1rem' }}>
            <h2>FeatherState Demo</h2>
            <p>Count: {counter.count}</p>
            <button onClick={increment}>Increment</button>{' '}
        </div>
    );
};

export default App;
