import { PrimaryKey } from '@mikro-orm/core';

// TODO: replace with ManyToOne when fully migrate to postgres
export const Environment = () => PrimaryKey({ name: 'environment_id', type: 'varchar', primary: true, length: 24 });
