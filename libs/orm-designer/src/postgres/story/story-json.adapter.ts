import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { StoryJSON, StoryObject } from './story.interface';

export const StoryJSONAdapter = createSmartMultiAdapter<StoryObject, StoryJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
