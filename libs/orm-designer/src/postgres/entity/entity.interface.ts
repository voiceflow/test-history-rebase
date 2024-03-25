import type { ToJSON, ToObject } from '@/types';

import type { EntityEntity } from './entity.entity';

export type EntityObject = ToObject<EntityEntity>;
export type EntityJSON = ToJSON<EntityObject>;
