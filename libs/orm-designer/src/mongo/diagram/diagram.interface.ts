import type { ToJSON, ToObject } from '@/types';

import type { DiagramEntity } from './diagram.entity';

export type DiagramObject = ToObject<DiagramEntity>;
export type DiagramJSON = ToJSON<DiagramObject>;
