self.importScripts("./slimstate.js");
const slimState = new SlimState();

self.onmessage = function(event) {
    console.log("Worker received data:", event.data);
    switch (event.data.method) {
        case 'get':
            return self.postMessage(slimState.state[event.data.key]);
        case 'set':
            const handler = () => {
                self.postMessage({key: event.data.key, value: slimState.state[event.data.key]});
                slimState.target.removeEventListener(event.data.key, handler)
            }
            slimState.target.addEventListener(event.data.key, handler)
            return slimState[event.data.key] = {...slimState[event.data.key], ...event.data.value};
        case 'create':
            slimState.createStore(event.data.key)
            return self.postMessage({key: event.data.key, value: slimState.state[event.data.key]});
        case 'delete':
            slimState.createStore(event.data.key)
            return self.postMessage({key: event.data.key, value: slimState.state[event.data.key]});
    }
};