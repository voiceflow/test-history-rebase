import type { ToJSON, ToObject } from '@/types';

import type { ReferenceResourceEntity } from './reference-resource.entity';

export type ReferenceResourceObject = ToObject<ReferenceResourceEntity>;
export type ReferenceResourceJSON = ToJSON<ReferenceResourceObject>;
