import type { ToJSON, ToObject } from '@/types';

import type { PromptEntity } from './prompt.entity';

export type PromptObject = ToObject<PromptEntity>;
export type PromptJSON = ToJSON<PromptObject>;
