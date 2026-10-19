function deepFreeze<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    Object.freeze(obj);
    for (const prop of Object.getOwnPropertyNames(obj)) {
        const val = (obj as any)[prop];
        if (val !== null && typeof val === 'object' && !Object.isFrozen(val)) {
            deepFreeze(val);
        }
    }
    return obj;
}

export class SlimState {
    public state = new Map<string, object>();
    public target = new EventTarget();
    private activeSidechains: Array<{ key: string; handler: EventListener }> = [];
    private storeHandlers = new Map<string, EventListener>();

    public createStore = <T extends object>(
        key: string,
        initialState: T
    ): [T, (value: T) => void, (key: string) => void] => {
        if (typeof initialState !== 'object' || initialState === null) {
            throw new TypeError('value must be a non-null object');
        }

        // PERF-01: Synchronous initial state store setting
        this.setValue(key, initialState ? initialState : {} as T);

        // Remove any previous store handler for this key
        const existingHandler = this.storeHandlers.get(key);
        if (existingHandler) {
            this.target.removeEventListener(key, existingHandler);
        }

        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<T>;
            this.setValue(key, customEvent.detail);
        };
        this.storeHandlers.set(key, handler);
        this.target.addEventListener(key, handler);

        const returnFn = (value: T) => {
            if (typeof value !== 'object' || value === null) {
                throw new TypeError('value must be a non-null object');
            }
            const event = new CustomEvent(key, { detail: value });
            this.target.dispatchEvent(event);
        };

        const destroyFn = (keyToDestroy: string) => {
            const h = this.storeHandlers.get(keyToDestroy);
            if (h) {
                this.target.removeEventListener(keyToDestroy, h);
                this.storeHandlers.delete(keyToDestroy);
            }
            this.activeSidechains = this.activeSidechains.filter(({ key: filterKey, handler: filterHandler }) => {
                if (filterKey === keyToDestroy) {
                    this.target.removeEventListener(keyToDestroy, filterHandler);
                    return false;
                }
                return true;
            });
            this.state.delete(keyToDestroy);
        };

        return [initialState, returnFn, destroyFn];
    };

    public deleteStore(key: string): void {
        const h = this.storeHandlers.get(key);
        if (h) {
            this.target.removeEventListener(key, h);
            this.storeHandlers.delete(key);
        }
        // PERF-02: Clean up active sidechains registered for key
        this.activeSidechains = this.activeSidechains.filter(({ key: filterKey, handler: filterHandler }) => {
            if (filterKey === key) {
                this.target.removeEventListener(key, filterHandler);
                return false;
            }
            return true;
        });
        this.state.delete(key);
        // Dispatch deletion event for reactive observers
        this.target.dispatchEvent(new CustomEvent(`delete-${key}`, { detail: { key } }));
    }

    public sideChainEffect(
        keys: string | Array<string>,
        handler: (detailOrEvent: any) => void
    ): () => void {
        const keyList = Array.isArray(keys) ? keys : [keys];
        const registeredHandlers: Array<{ key: string; listener: EventListener }> = [];

        keyList.forEach((key) => {
            const wrappedListener: EventListener = (e: Event) => {
                const customEvent = e as CustomEvent;
                const payload = customEvent.detail !== undefined ? customEvent.detail : customEvent;
                handler(payload);
            };
            this.target.addEventListener(key, wrappedListener);
            const entry = { key, handler: wrappedListener };
            this.activeSidechains.push(entry);
            registeredHandlers.push({ key, listener: wrappedListener });
        });

        return () => {
            registeredHandlers.forEach(({ key, listener }) => {
                this.target.removeEventListener(key, listener);
            });
            this.activeSidechains = this.activeSidechains.filter(
                (item) => !registeredHandlers.some((rh) => rh.key === item.key && rh.listener === item.handler)
            );
        };
    }

    public reduce<T, U>(key: string, reducer: (data: T) => U): U {
        const data = this.get<T>(key);
        return reducer(data);
    }

    public set<T>(key: string, value: T, asEvent: boolean = false): void {
        if (typeof value !== 'object' || value === null) {
            throw new TypeError('value must be a non-null object');
        }
        if (asEvent) {
            const event = new CustomEvent(key, { detail: value });
            this.target.dispatchEvent(event);
        } else {
            this.setValue(key, value as unknown as object);
            // Dispatch event for observers/adapters
            this.target.dispatchEvent(new CustomEvent(key, { detail: value }));
        }
    }

    private setValue(key: string, value: object): void {
        // SEC-01: Deep clone and deep freeze to guarantee immutability
        try {
            const cloned = typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
            const frozenValue = deepFreeze(cloned);
            this.state.set(key, frozenValue);
        } catch {
            const frozenValue = deepFreeze({ ...value });
            this.state.set(key, frozenValue);
        }
    }

    public get<T>(key: string): T {
        const value = this.state.get(key);
        if (!value) return undefined as unknown as T;
        try {
            const cloned = typeof structuredClone === 'function'
                ? structuredClone(value) as T
                : JSON.parse(JSON.stringify(value)) as T;
            return deepFreeze(cloned);
        } catch {
            return deepFreeze({ ...value }) as unknown as T;
        }
    }
}
