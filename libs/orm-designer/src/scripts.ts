import { MikroORM } from '@mikro-orm/core';
import type { Options } from '@mikro-orm/postgresql';

import postgresConfig from './postgres/mikro-orm.config';

export const migrateUp = async () => {
  const fullConfig: Options = {
    ...postgresConfig,

    discovery: {
      warnWhenNoEntities: false,
      requireEntitiesArray: false,
    },

    tsNode: false,
  };

  const orm = await MikroORM.init(fullConfig);
  const migrator = orm.getMigrator();

  try {
    await migrator.up();
  } finally {
    await orm.close(true);
  }
};
