import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { ProgramJSONAdapter } from '../program';
import type { PrototypeProgramJSON, PrototypeProgramObject } from './prototype-program.interface';

export const PrototypeProgramJSONAdapter = createSmartMultiAdapter<PrototypeProgramObject, PrototypeProgramJSON>(
  ProgramJSONAdapter.fromDB,
  ProgramJSONAdapter.toDB
);
