import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { VariableEntity } from './variable.entity';

export const VariableJSONAdapter = createSmartMultiAdapter<
  EntityObject<VariableEntity>,
  ToJSONWithForeignKeys<VariableEntity>,
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
