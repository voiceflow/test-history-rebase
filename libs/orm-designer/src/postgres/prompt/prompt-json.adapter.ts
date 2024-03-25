import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { PromptJSON, PromptObject } from './prompt.interface';

export const PromptJSONAdapter = createSmartMultiAdapter<PromptObject, PromptJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
