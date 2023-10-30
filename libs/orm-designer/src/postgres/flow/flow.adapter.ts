import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { FlowEntity } from './flow.entity';

export const FlowJSONAdapter = createSmartMultiAdapter<
  EntityObject<FlowEntity>,
  ToJSONWithForeignKeys<FlowEntity>,
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
