import type { ToJSON, ToObject } from '@/types';

import type { RequiredEntityEntity } from './required-entity.entity';

export type RequiredEntityObject = ToObject<RequiredEntityEntity>;
export type RequiredEntityJSON = ToJSON<RequiredEntityObject>;
