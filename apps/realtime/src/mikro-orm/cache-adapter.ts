import fs from 'node:fs/promises';
import path from 'node:path';

import { NullCacheAdapter } from '@mikro-orm/core';

export class CacheAdapter extends NullCacheAdapter {
  constructor(private readonly options: { cacheDir: string }) {
    super();
  }

  async get(name: string): Promise<any> {
    const tsResult = JSON.parse(await fs.readFile(path.resolve(this.options.cacheDir, `${name}.json`), 'utf-8'));

    return tsResult.data;
  }
}
