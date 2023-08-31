import { CRUDState } from '@/ducks/utils/crudV2';
import { Transcript } from '@/models';

export interface TranscriptState extends CRUDState<Transcript> {
  hasUnreadTranscripts: boolean;
}
