# @creadev.org/storage

> Storage - brain, memory, islands

[![npm](https://img.shields.io/npm/v/@creadev.org/storage)](https://www.npmjs.com/package/@creadev.org/storage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm install @creadev.org/storage
```

## Usage

```typescript
import { Storage, Brain, createStorage } from '@creadev.org/storage';

const store = createStorage('my-data');
await store.set('key', { data: 'value' });
const value = await store.get('key');
const list = await store.list();
```

## API

| Class | Description |
|-------|-------------|
| `Storage<T>` | Key-value storage |
| `Brain` | Memory islands |
| `createStorage(name, options?)` | Create storage instance |

## License

MIT
trigger
# Mon May 11 15:11:18 UTC 2026
