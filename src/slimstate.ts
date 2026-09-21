export class SlimState {
    public state = new WeakMap();
    public target = new EventTarget();
    private activeSidechains: Array<{key: string, handler: Function}> = [];
    public createStore = (key: string, initialState: object) => {
        if (typeof initialState !== 'object') return [new Error('value must be an object')];
        queueMicrotask(() => {
            this.setValue(key, initialState ? initialState : {})
        })
        const handler = (key: string, value: any) => queueMicrotask(() => {
                this.setValue(key, value);
            })
        
        const returnFn = (value: object) => {
            queueMicrotask(() => {
                const event = new Event(key, value)
                this.target.dispatchEvent(event)
            })
        }
        const destroyFn = (key: string) =>  {
            queueMicrotask(() => {
                this.target.removeEventListener(key, handler as any)
                this.activeSidechains = this.activeSidechains.filter(({key: filterKey, handler}) => {
                    if (filterKey === key) {
                        this.target.removeEventListener(key, handler as any)
                        return false;
                    } else return true;
                })
            })
        }
        this.target.addEventListener(key, handler as any)
        return [initialState, returnFn, destroyFn]
    }
    public deleteStore (key: string) {
        queueMicrotask(() => {
            this.state.delete(key as any);
        })
    }
    public sideChainEffect (keys: Array<string>, handler: Function) {
        queueMicrotask(() => {
            keys.forEach((key) => {
                this.target.addEventListener(key, handler as any)
                this.activeSidechains.push({key, handler})
            })
        });
    }
    public reduce(key: string, reducer: Function) {
        const data = this.get(key)
        return reducer(data)
    }
    public set (key: string, value: any, asEvent: boolean) {
        if (typeof value !== 'object') {
            return new Error('value must be an object');
        }
        if (asEvent) {
            const event = new Event(key, value)
            this.target.dispatchEvent(event)
        }
        else {
            this.setValue(key, value)
        }
    }
    private setValue(key: string, value: object) {       
        queueMicrotask(() => {
            const keys = Object.keys(value);
            (keys as any).forEach((vkey: string) => {
                (value as any)[vkey] = Object.freeze((value as any)[vkey]);
            })
            this.state.set(key as any, Object.freeze(value));
        })
    }
    public get (key: string) {
        return { ...(this.state as any)[key] }
    }
}