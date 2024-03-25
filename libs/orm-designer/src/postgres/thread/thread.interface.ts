import type { ToJSON, ToObject } from '@/types';

import type { ThreadEntity } from './thread.entity';

export type ThreadObject = ToObject<ThreadEntity>;
export type ThreadJSON = ToJSON<ThreadObject>;
