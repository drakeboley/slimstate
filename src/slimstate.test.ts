import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SlimState } from './slimstate.js';
import { createStore, set, get, deleteStore, reduce, sideChainEffect } from './index.js';

describe('SlimState', () => {
    test('createStore initializes data synchronously and immutably', () => {
        const state = new SlimState();
        state.createStore('testKey', { foo: 'bar', nested: { val: 42 } });
        
        const data = state.get<{ foo: string; nested: { val: number } }>('testKey');
        assert.deepStrictEqual(data, { foo: 'bar', nested: { val: 42 } });

        // SEC-01: Deep freeze / immutability verification
        assert.throws(() => {
            (data.nested as any).val = 999;
        }, /Cannot assign to read only property|TypeError/);
    });

    test('set updates data', () => {
        const state = new SlimState();
        state.createStore('testKey', { foo: 'bar' });
        state.set('testKey', { foo: 'baz' });
        
        const data = state.get('testKey');
        assert.deepStrictEqual(data, { foo: 'baz' });
    });

    test('reduce returns reduced data', () => {
        const state = new SlimState();
        state.createStore('numKey', { count: 1 });
        
        const result = state.reduce('numKey', (data: any) => {
            return { count: data.count + 1 };
        });
        assert.deepStrictEqual(result, { count: 2 });
    });

    test('deleteStore removes data and sidechains', () => {
        const state = new SlimState();
        state.createStore('delKey', { keep: false });
        
        let sidechainCalled = false;
        state.sideChainEffect('delKey', () => {
            sidechainCalled = true;
        });

        state.deleteStore('delKey');
        const data = state.get('delKey');
        assert.strictEqual(data, undefined);

        // Dispatches on deleted key should no longer trigger sidechain
        state.target.dispatchEvent(new CustomEvent('delKey', { detail: { keep: true } }));
        assert.strictEqual(sidechainCalled, false);
    });

    test('sideChainEffect accepts string or array of strings', () => {
        const state = new SlimState();
        state.createStore('storeA', { val: 'a' });
        state.createStore('storeB', { val: 'b' });

        const received: string[] = [];
        state.sideChainEffect(['storeA', 'storeB'], (detail: any) => {
            received.push(detail.val);
        });

        state.set('storeA', { val: 'a2' });
        state.set('storeB', { val: 'b2' });

        assert.deepStrictEqual(received, ['a2', 'b2']);
    });

    test('set throws error on non-object inputs', () => {
        const state = new SlimState();
        assert.throws(() => {
            state.set('badKey', null as any);
        }, TypeError);

        assert.throws(() => {
            state.set('badKey', 'notAnObject' as any);
        }, TypeError);
    });

    test('standalone exported functions work on default instance', () => {
        createStore('globalKey', { status: 'active' });
        assert.deepStrictEqual(get('globalKey'), { status: 'active' });

        set('globalKey', { status: 'complete' });
        assert.deepStrictEqual(get('globalKey'), { status: 'complete' });

        deleteStore('globalKey');
        assert.strictEqual(get('globalKey'), undefined);
    });
});
