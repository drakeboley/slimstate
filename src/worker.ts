self.importScripts("./featherstate.js");
const featherState = new FeatherState();

self.onmessage = function(event) {
    console.log("Worker received data:", event.data);
    switch (event.data.method) {
        case 'get':
            return self.postMessage(featherState.state[event.data.key]);
        case 'set':
            const handler = () => {
                self.postMessage({key: event.data.key, value: featherState.state[event.data.key]});
                featherState.target.removeEventListener(event.data.key, handler)
            }
            featherState.target.addEventListener(event.data.key, handler)
            return featherState[event.data.key] = {...featherState[event.data.key], ...event.data.value};
        case 'create':
            featherState.createStore(event.data.key)
            return self.postMessage({key: event.data.key, value: featherState.state[event.data.key]});
        case 'delete':
            featherState.createStore(event.data.key)
            return self.postMessage({key: event.data.key, value: featherState.state[event.data.key]});
    }
};