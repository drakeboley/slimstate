import { SlimStateInstance } from "./index.js"

export const useSlimState = (key: string, state: any = {}) => {
    return SlimStateInstance.createStore(key, state)
}
export default useSlimState;