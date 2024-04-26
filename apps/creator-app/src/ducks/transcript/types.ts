import type { CRUDState } from '@/ducks/utils/crudV2';
import type { Transcript } from '@/models';

export interface TranscriptState extends CRUDState<Transcript> {
  hasUnreadTranscripts: boolean;
}
