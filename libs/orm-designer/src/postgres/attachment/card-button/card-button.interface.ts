import type { ToJSON, ToObject } from '@/types';

import type { CardButtonEntity } from './card-button.entity';

export type CardButtonObject = ToObject<CardButtonEntity>;
export type CardButtonJSON = ToJSON<CardButtonObject>;
