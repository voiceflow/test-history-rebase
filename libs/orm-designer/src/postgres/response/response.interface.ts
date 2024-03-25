import type { ToJSON, ToObject } from '@/types';

import type { ResponseEntity } from './response.entity';

export type ResponseObject = ToObject<ResponseEntity>;
export type ResponseJSON = ToJSON<ResponseObject>;
