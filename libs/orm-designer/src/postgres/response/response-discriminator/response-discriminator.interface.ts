import type { ToJSON, ToObject } from '@/types';

import type { ResponseDiscriminatorEntity } from './response-discriminator.entity';

export type ResponseDiscriminatorObject = ToObject<ResponseDiscriminatorEntity>;
export type ResponseDiscriminatorJSON = ToJSON<ResponseDiscriminatorObject>;
