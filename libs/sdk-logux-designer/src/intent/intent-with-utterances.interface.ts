import type { Intent } from './intent.interface';
import type { Utterance } from './utterance/utterance.interface';

export interface IntentWithUtterances extends Intent {
  utterances: Utterance[];
}
