import { PrimaryKey } from '@mikro-orm/core';

export const ObjectIDPrimaryKey = () => PrimaryKey({ type: 'varchar', nullable: false, length: 24 });
