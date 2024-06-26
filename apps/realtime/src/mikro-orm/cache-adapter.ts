import fs from 'node:fs';
import path from 'node:path';

import { NullCacheAdapter } from '@mikro-orm/core';

export class CacheAdapter extends NullCacheAdapter {
  constructor(private readonly options: { cacheDir: string }) {
    super();
  }

  get(name: string): any {
    const result = JSON.parse(fs.readFileSync(path.resolve(this.options.cacheDir, `${name}.json`), 'utf-8'));

    return result.data;
  }
}
