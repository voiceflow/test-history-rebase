import type { ToJSON, ToObject } from '@/types';

import type { UtteranceEntity } from './utterance.entity';

export type UtteranceObject = ToObject<UtteranceEntity>;
export type UtteranceJSON = ToJSON<UtteranceObject>;
