import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { IntentEntity } from './intent.entity';

export const IntentJSONAdapter = createSmartMultiAdapter<
  EntityObject<IntentEntity>,
  ToJSONWithForeignKeys<IntentEntity>,
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
