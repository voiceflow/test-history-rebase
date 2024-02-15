import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularEntityAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { EventEntity } from './event.entity';

export const EventEntityAdapter = createSmartMultiAdapter<
  EntityObject<EventEntity>,
  ToJSONWithForeignKeys<EventEntity>,
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
