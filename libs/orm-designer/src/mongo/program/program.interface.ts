import type { ToJSON, ToObject } from '@/types';

import type { ProgramEntity } from './program.entity';

export type ProgramObject = ToObject<ProgramEntity>;
export type ProgramJSON = ToJSON<ProgramObject>;
