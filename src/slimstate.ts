export class SlimState {
    public state = new Map<string, object>();
    public target = new EventTarget();
    private activeSidechains: Array<{key: string, handler: EventListener}> = [];

    public createStore = <T extends object>(key: string, initialState: T): [T, (value: T) => void, (key: string) => void] => {
        if (typeof initialState !== 'object') throw new Error('value must be an object');
        
        queueMicrotask(() => {
            this.setValue(key, initialState ? initialState : {});
        });

        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<T>;
            queueMicrotask(() => {
                this.setValue(key, customEvent.detail);
            });
        };
        
        const returnFn = (value: T) => {
            queueMicrotask(() => {
                const event = new CustomEvent(key, { detail: value });
                this.target.dispatchEvent(event);
            });
        };

        const destroyFn = (keyToDestroy: string) =>  {
            queueMicrotask(() => {
                this.target.removeEventListener(keyToDestroy, handler);
                this.activeSidechains = this.activeSidechains.filter(({key: filterKey, handler: filterHandler}) => {
                    if (filterKey === keyToDestroy) {
                        this.target.removeEventListener(keyToDestroy, filterHandler);
                        return false;
                    } else return true;
                });
            });
        };

        this.target.addEventListener(key, handler);
        return [initialState, returnFn, destroyFn];
    }

    public deleteStore (key: string) {
        queueMicrotask(() => {
            this.state.delete(key);
        });
    }

    public sideChainEffect (keys: Array<string>, handler: EventListener) {
        queueMicrotask(() => {
            keys.forEach((key) => {
                this.target.addEventListener(key, handler);
                this.activeSidechains.push({key, handler});
            });
        });
    }

    public reduce<T, U>(key: string, reducer: (data: T) => U): U {
        const data = this.get<T>(key);
        return reducer(data);
    }

    public set<T> (key: string, value: T, asEvent: boolean = false) {
        if (typeof value !== 'object' || value === null) {
            return new Error('value must be an object');
        }
        if (asEvent) {
            const event = new CustomEvent(key, { detail: value });
            this.target.dispatchEvent(event);
        } else {
            this.setValue(key, value as unknown as object);
        }
    }

    private setValue(key: string, value: object) {       
        queueMicrotask(() => {
            // Shallow clone and freeze
            const frozenValue = Object.freeze({ ...value });
            this.state.set(key, frozenValue);
        });
    }

    public get<T>(key: string): T {
        const value = this.state.get(key);
        return (value ? { ...value } : undefined) as unknown as T;
    }
}
