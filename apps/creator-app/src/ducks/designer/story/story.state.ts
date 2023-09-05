import type { Story } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'story';

export interface StoryState extends Normalized<Story> {}
