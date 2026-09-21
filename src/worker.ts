self.importScripts("./event-state.js");
const eventState = new EventState();

self.onmessage = function(event) {
    console.log("Worker received data:", event.data);
    switch (event.data.method) {
        case 'get':
            return self.postMessage(eventState.state[event.data.key]);
        case 'set':
            const handler = () => {
                self.postMessage({key: event.data.key, value: eventState.state[event.data.key]});
                eventState.target.removeEventListener(event.data.key, handler)
            }
            eventState.target.addEventListener(event.data.key, handler)
            return eventState[event.data.key] = {...eventState[event.data.key], ...event.data.value};
        case 'create':
            eventState.createStore(event.data.key)
            return self.postMessage({key: event.data.key, value: eventState.state[event.data.key]});
        case 'delete':
            eventState.createStore(event.data.key)
            return self.postMessage({key: event.data.key, value: eventState.state[event.data.key]});
    }
};