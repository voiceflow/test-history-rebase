import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSON } from '@/types';

import { ProgramEntityAdapter } from '../program';
import type { PrototypeProgramEntity } from './prototype-program.entity';

export const PrototypeProgramEntityAdapter = createSmartMultiAdapter<
  EntityObject<PrototypeProgramEntity>,
  ToJSON<PrototypeProgramEntity>
>(
  (data) => ProgramEntityAdapter.fromDB(data),
  (data) => ProgramEntityAdapter.toDB(data)
);
