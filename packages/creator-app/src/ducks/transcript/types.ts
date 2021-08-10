import * as CRUD from '@/ducks/utils/crud';
import { Transcript } from '@/models';

export type TranscriptState = CRUD.CRUDState<Transcript> & {
  hasUnreadTranscripts: boolean;
};
