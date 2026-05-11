import { describe, it, expect } from 'vitest';
import { Storage, createStorage } from '../src/index';

describe('Storage', () => {
  it('creates storage', () => {
    const storage = createStorage('test');
    expect(storage).toBeDefined();
  });
});
