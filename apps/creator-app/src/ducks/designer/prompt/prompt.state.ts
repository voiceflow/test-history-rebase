import type { Prompt } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'prompt';

export interface PromptState extends Normalized<Prompt> {}
