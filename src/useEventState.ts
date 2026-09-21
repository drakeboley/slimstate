import { EventStateInstance } from "./index.js"

export const useEventState = (key: string, state: any = {}) => {
    return EventStateInstance.createStore(key, state)
}
export default useEventState;