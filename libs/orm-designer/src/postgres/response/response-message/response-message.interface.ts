import type { ToJSON, ToObject } from '@/types';

import type { ResponseMessageEntity } from './response-message.entity';

export type ResponseMessageObject = ToObject<ResponseMessageEntity>;
export type ResponseMessageJSON = ToJSON<ResponseMessageObject>;
