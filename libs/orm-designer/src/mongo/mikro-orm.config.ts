import path from 'node:path';

import { defineConfig } from '@mikro-orm/mongodb';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  entities: ['./build/mongo/**/*.entity.js'],
  entitiesTs: ['./src/mongo/**/*.entity.ts'],

  cache: {
    enabled: true,
    options: {
      cacheDir: path.resolve(__dirname, '../../.mikro-orm'),
    },
  },
});
