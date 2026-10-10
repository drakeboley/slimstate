import { SlimState } from "./slimstate.js";
const slimState = new SlimState();

self.onmessage = function(event) {
    switch (event.data.method) {
        case 'get':
            return self.postMessage({ method: 'get', key: event.data.key, value: slimState.get(event.data.key) });
        case 'set':
            {
                const handler = (e: Event) => {
                    const customEvent = e as CustomEvent;
                    self.postMessage({ method: 'set', key: event.data.key, value: slimState.get(event.data.key) });
                    slimState.target.removeEventListener(event.data.key, handler);
                };
                slimState.target.addEventListener(event.data.key, handler);
                slimState.set(event.data.key, event.data.value, true);
                return;
            }
        case 'create':
            slimState.createStore(event.data.key, event.data.value || {});
            return self.postMessage({ method: 'create', key: event.data.key, value: slimState.get(event.data.key) });
        case 'delete':
            slimState.deleteStore(event.data.key);
            return self.postMessage({ method: 'delete', key: event.data.key });
    }
};
