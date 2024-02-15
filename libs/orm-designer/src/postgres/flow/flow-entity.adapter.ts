import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularEntityAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { FlowEntity } from './flow.entity';

export const FlowEntityAdapter = createSmartMultiAdapter<
  EntityObject<FlowEntity>,
  ToJSONWithForeignKeys<FlowEntity>,
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
