import { MikroORM } from '@mikro-orm/core';
import type { Options } from '@mikro-orm/mongodb';

import mongoConfig from './mongo/mikro-orm.config';

export const migrateUp = async () => {
  const fullConfig: Options = {
    ...mongoConfig,

    discovery: {
      warnWhenNoEntities: false,
      requireEntitiesArray: false,
    },
  };

  const orm = await MikroORM.init(fullConfig);
  const migrator = orm.getMigrator();

  try {
    await migrator.up();
  } finally {
    await orm.close(true);
  }
};
