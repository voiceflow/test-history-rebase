import type { Transcript } from '@/models';

export interface ListData {
  transcripts: Transcript[];
  currentTranscriptID: string | null;
}
