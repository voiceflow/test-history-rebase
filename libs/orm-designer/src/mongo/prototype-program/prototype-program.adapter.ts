import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSON } from '@/types';

import { ProgramJSONAdapter } from '../program';
import type { PrototypeProgramEntity } from './prototype-program.entity';

export const PrototypeProgramJSONAdapter = createSmartMultiAdapter<
  EntityObject<PrototypeProgramEntity>,
  ToJSON<PrototypeProgramEntity>
>(
  (data) => ProgramJSONAdapter.fromDB(data),
  (data) => ProgramJSONAdapter.toDB(data)
);
