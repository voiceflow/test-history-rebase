import type { ToJSON, ToObject } from '@/types';

import type { PrototypeProgramEntity } from './prototype-program.entity';

export type PrototypeProgramObject = ToObject<PrototypeProgramEntity>;
export type PrototypeProgramJSON = ToJSON<PrototypeProgramObject>;
