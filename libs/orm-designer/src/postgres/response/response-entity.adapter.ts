import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularEntityAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { ResponseEntity } from './response.entity';

export const ResponseEntityAdapter = createSmartMultiAdapter<
  EntityObject<ResponseEntity>,
  ToJSONWithForeignKeys<ResponseEntity>,
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
