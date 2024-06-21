import path from 'node:path';

import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  entities: ['./build/postgres/**/*.entity.js', './build/postgres/**/*.stub.js'],
  entitiesTs: ['./src/postgres/**/*.entity.ts', './src/postgres/**/*.stub.ts'],

  migrations: {
    path: path.resolve(__dirname, '../../build/postgres/migrations'),
    pathTs: path.resolve(__dirname, '../../src/postgres/migrations'),
    tableName: 'designer_migrations',
    disableForeignKeys: false,
  },

  metadataCache: {
    enabled: true,
    options: {
      cacheDir: path.resolve(__dirname, '../../.mikro-orm'),
    },
  },
});
