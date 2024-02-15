import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularEntityAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { VariableEntity } from './variable.entity';

export const VariableEntityAdapter = createSmartMultiAdapter<
  EntityObject<VariableEntity>,
  ToJSONWithForeignKeys<VariableEntity>,
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
