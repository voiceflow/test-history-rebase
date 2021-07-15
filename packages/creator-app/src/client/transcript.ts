import dialogsAdapter from '@/client/adapters/transcripts/dialogs';
import transcriptAdapter from '@/client/adapters/transcripts/transcripts';
import { TagType, Transcript } from '@/models';

import { apiV2 } from './fetch';

export const TRANSCRIPT_PATH = 'transcripts';

const transcriptClient = {
  find: (projectID: string, queryParams?: string) =>
    apiV2.get<Transcript[]>(`${TRANSCRIPT_PATH}/${projectID}?${queryParams ?? ''}`).then(transcriptAdapter.mapFromDB),

  patchTranscript: (projectID: string, transcriptID: string, data: { notes?: string; tags?: TagType; unread?: boolean }) =>
    apiV2.patch<Transcript>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`, { data }),

  deleteTranscript: (projectID: string, transcriptID: string) => apiV2.delete(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`),

  createTranscript: (data: Partial<Transcript> & { versionID: string | null }, projectID: string | null) =>
    apiV2.put(TRANSCRIPT_PATH, { ...data, projectID: projectID || undefined }),

  getTranscriptDialog: (projectID: string, transcriptID: string) =>
    apiV2.get<any[]>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`).then(dialogsAdapter.mapFromDB),
};

export default transcriptClient;
