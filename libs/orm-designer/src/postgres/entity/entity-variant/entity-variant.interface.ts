import type { ToJSON, ToObject } from '@/types';

import type { EntityVariantEntity } from './entity-variant.entity';

export type EntityVariantObject = ToObject<EntityVariantEntity>;
export type EntityVariantJSON = ToJSON<EntityVariantObject>;
