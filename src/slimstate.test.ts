import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SlimState } from './slimstate.js';

const waitMicrotasks = () => new Promise(resolve => setTimeout(resolve, 0));

describe('SlimState', () => {
    test('createStore initializes data', async () => {
        const state = new SlimState();
        state.createStore('testKey', { foo: 'bar' });
        
        await waitMicrotasks();
        const data = state.get('testKey');
        assert.deepStrictEqual(data, { foo: 'bar' });
    });

    test('set updates data', async () => {
        const state = new SlimState();
        state.createStore('testKey', { foo: 'bar' });
        
        await waitMicrotasks();
        state.set('testKey', { foo: 'baz' });
        
        await waitMicrotasks();
        const data = state.get('testKey');
        assert.deepStrictEqual(data, { foo: 'baz' });
    });

    test('reduce returns reduced data', async () => {
        const state = new SlimState();
        state.createStore('numKey', { count: 1 });
        
        await waitMicrotasks();
        const result = state.reduce('numKey', (data: any) => {
            return { count: data.count + 1 };
        });
        assert.deepStrictEqual(result, { count: 2 });
    });

    test('deleteStore removes data', async () => {
        const state = new SlimState();
        state.createStore('delKey', { keep: false });
        
        await waitMicrotasks();
        state.deleteStore('delKey');
        
        await waitMicrotasks();
        const data = state.get('delKey');
        assert.strictEqual(data, undefined);
    });
});
