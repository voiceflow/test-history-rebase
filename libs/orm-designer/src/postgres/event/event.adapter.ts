import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { EventEntity } from './event.entity';

export const EventJSONAdapter = createSmartMultiAdapter<
  EntityObject<EventEntity>,
  ToJSONWithForeignKeys<EventEntity>,
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
