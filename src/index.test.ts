import { describe, it, expect, beforeEach } from 'vitest';
import { Storage, Brain, createStorage, createBrain, get, set, list } from '../src/index';

describe('Storage', () => {
  let storage: Storage;
  beforeEach(() => { storage = createStorage(); });
  it('creates storage', () => { expect(storage).toBeDefined(); });
  it('has set/get', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });
});

describe('Brain', () => {
  it('creates brain', () => {
    const brain = createBrain();
    expect(brain).toBeDefined();
  });
});
