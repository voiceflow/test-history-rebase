import type { Utterance } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'utterance';

export interface UtteranceState extends Normalized<Utterance> {}
