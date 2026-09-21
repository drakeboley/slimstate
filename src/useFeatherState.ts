import { FeatherStateInstance } from "./index.js"

export const useFeatherState = (key: string, state: any = {}) => {
    return FeatherStateInstance.createStore(key, state)
}
export default useFeatherState;