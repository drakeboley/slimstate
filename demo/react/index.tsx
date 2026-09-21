import React from 'react';
import { useEventState } from '../../src/useEventState.js';
import { EventStateInstance } from '../../src/index.js';

const App = () => {
    // Create a store for counter if not already present
    let counter: {
        count: number
    }
    let setCounter: Function
    const EventStateHook = useEventState('counter', { count: 0 }) as [typeof counter, Function, Function];
    if (EventStateHook.length <= 1) return null;
    [counter, setCounter] = EventStateHook;

    // Side effect that logs changes to both counter and message stores
    React.useEffect(() => {
        const logHandler = (e: Event) => {
            console.log(`Event ${e.type} fired with detail`, e);
        };
        EventStateInstance.sideChainEffect(['counter', 'message'], logHandler);
        return () => {
            // Cleanup listeners when component unmounts
            EventStateInstance.deleteStore('counter');
        };
    }, []);

    const increment = () => setCounter({ count: counter.count + 1 });

    return (
        <div style={{ padding: '1rem' }}>
            <h2>EventState Demo</h2>
            <p>Count: {counter.count}</p>
            <button onClick={increment}>Increment</button>{' '}
        </div>
    );
};

export default App;
