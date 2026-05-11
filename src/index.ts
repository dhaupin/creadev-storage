/**
 * @creadev.org/storage
 *
 * Storage - brain, memory, islands.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface StorageOptions {
  name?: string;
  maxSize?: number;
}

export interface StorageEntry<T> {
  key: string;
  value: T;
  createdAt: number;
  updatedAt: number;
  meta: Record<string, unknown>;
}

// ============================================================================
// STORAGE
// ============================================================================

export class Storage<T = unknown> {
  private name: string;
  private entries = new Map<string, StorageEntry<T>>();
  private maxSize: number;
  private keyOrder: string[] = [];

  constructor(name: string, options: StorageOptions = {}) {
    this.name = name;
    this.maxSize = options.maxSize ?? 1000;
  }

  set(key: string, value: T, meta?: Record<string, unknown>): void {
    if (this.entries.size >= this.maxSize && !this.entries.has(key)) {
      this.evict();
    }

    const existing = this.entries.get(key);
    const now = Date.now();

    this.entries.set(key, {
      key,
      value,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      meta: meta ?? {},
    });

    if (!existing) {
      this.keyOrder.push(key);
    }
  }

  get(key: string): T | undefined {
    return this.entries.get(key)?.value;
  }

  getEntry(key: string): StorageEntry<T> | undefined {
    return this.entries.get(key);
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  delete(key: string): boolean {
    const deleted = this.entries.delete(key);
    if (deleted) {
      const idx = this.keyOrder.indexOf(key);
      if (idx >= 0) this.keyOrder.splice(idx, 1);
    }
    return deleted;
  }

  clear(): void {
    this.entries.clear();
    this.keyOrder = [];
  }

  private evict(): void {
    if (this.keyOrder.length === 0) return;
    const oldest = this.keyOrder[0];
    this.delete(oldest);
  }

  keyList(): string[] {
    return [...this.keyOrder];
  }

  valueList(): T[] {
    return this.keyOrder.map(k => this.entries.get(k)?.value).filter(Boolean) as T[];
  }

  size(): number {
    return this.entries.size;
  }

  search(query: string): { key: string; value: T }[] {
    const q = query.toLowerCase();
    return this.keyOrder
      .map(k => {
        const entry = this.entries.get(k)!;
        const text = JSON.stringify(entry.value).toLowerCase();
        return { key: k, value: entry.value, score: text.includes(q) ? 1 : 0 };
      })
      .filter(r => r.score > 0)
      .map(r => ({ key: r.key, value: r.value }));
  }
}

// ============================================================================
// BRAIN
// ============================================================================

export class Brain {
  private stores = new Map<string, Storage>();

  store(name: string, options?: StorageOptions): Storage {
    let store = this.stores.get(name);
    if (!store) {
      store = new Storage(name, options);
      this.stores.set(name, store);
    }
    return store;
  }

  get(name: string): Storage | undefined {
    return this.stores.get(name);
  }

  delete(name: string): boolean {
    return this.stores.delete(name);
  }

  list(): string[] {
    return Array.from(this.stores.keys());
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createStorage<T>(name: string, options?: StorageOptions): Storage<T> {
  return new Storage<T>(name, options);
}

export function createBrain(): Brain {
  return new Brain();
}