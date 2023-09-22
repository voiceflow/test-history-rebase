import fs from 'node:fs/promises';
import path from 'node:path';

import { NullCacheAdapter } from '@mikro-orm/core';

export class CacheAdapter extends NullCacheAdapter {
  constructor(private readonly options: { cacheDir: string }) {
    super();
  }

  async get(name: string): Promise<any> {
    // const tsName = name.replace(/\.js$/, '.ts');
    // eslint-disable-next-line no-console
    console.log('OPTIONS', this.options);

    const tsResult = JSON.parse(
      await fs.readFile(path.resolve(`/Users/matheuspoleza/Workspace/Voiceflow/frontend/libs/orm-designer/.mikro-orm/${name}.json`), 'utf-8')
    );

    return tsResult.data;
  }
}
