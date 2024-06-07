import type { ToJSON, ToObject } from '@/types';

import type { ReferenceEntity } from './reference.entity';

export type ReferenceObject = ToObject<ReferenceEntity>;
export type ReferenceJSON = ToJSON<ReferenceObject>;
