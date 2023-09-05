import type { Utterance } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'utterance';

export interface UtteranceState extends Normalized<Utterance> {}
