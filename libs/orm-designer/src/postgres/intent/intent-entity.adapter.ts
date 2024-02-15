import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularEntityAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { IntentEntity } from './intent.entity';

export const IntentEntityAdapter = createSmartMultiAdapter<
  EntityObject<IntentEntity>,
  ToJSONWithForeignKeys<IntentEntity>,
  [],
  [],
  CMSTabularKeyRemap
>(
  ({ ...data }) => ({
    ...PostgresCMSTabularEntityAdapter.fromDB(data),
  }),
  ({ ...data }) => ({
    ...PostgresCMSTabularEntityAdapter.toDB(data),
  })
);
