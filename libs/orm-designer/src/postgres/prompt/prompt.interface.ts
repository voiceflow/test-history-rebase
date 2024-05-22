import type { ToJSON, ToObject } from '@/types';

import type { PromptEntity } from './prompt.entity';

export type { Prompt, PromptSettings } from '@voiceflow/dtos';

export type PromptObject = ToObject<PromptEntity>;
export type PromptJSON = ToJSON<PromptObject>;
