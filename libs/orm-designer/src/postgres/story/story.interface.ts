import type { ToJSON, ToObject } from '@/types';

import type { StoryEntity } from './story.entity';

export type StoryObject = ToObject<StoryEntity>;
export type StoryJSON = ToJSON<StoryObject>;
