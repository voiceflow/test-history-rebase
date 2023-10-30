import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { EntityEntity } from './entity.entity';

export const EntityJSONAdapter = createSmartMultiAdapter<
  EntityObject<EntityEntity>,
  ToJSONWithForeignKeys<EntityEntity>,
  [],
  [],
  CMSTabularKeyRemap
>(
  ({ ...data }) => ({
    ...PostgresCMSTabularJSONAdapter.fromDB(data),
  }),
  ({ ...data }) => ({
    ...PostgresCMSTabularJSONAdapter.toDB(data),
  })
);
