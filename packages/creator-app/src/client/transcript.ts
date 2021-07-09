import dialogsAdapter from '@/client/adapters/transcripts/dialogs';
import transcriptAdapter from '@/client/adapters/transcripts/transcripts';
import { TagType, Transcript } from '@/models';

import { apiV2 } from './fetch';

export const TRANSCRIPT_PATH = 'transcripts';

const transcriptClient = {
  find: (projectID: string, queryParams?: string) =>
    apiV2
      .get<Transcript[]>(`${TRANSCRIPT_PATH}/${projectID}?${queryParams}`)
      .then((transcripts) => transcripts?.map((transcript) => transcriptAdapter.fromDB(transcript))),

  patchTranscript: (projectID: string, transcriptID: string, data: { notes?: string; tags?: TagType; unread?: boolean }) =>
    apiV2.patch<Transcript>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`, { data }).then((transcript) => transcript),

  deleteTranscript: (projectID: string, transcriptID: string) => apiV2.delete(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`),

  createTranscript: (data: Partial<Transcript> & { versionID: string | null }, projectID: string | null) =>
    apiV2.put(`${TRANSCRIPT_PATH}`, { ...data, projectID: projectID || undefined }),

  getTranscriptDialog: (projectID: string, transcriptID: string) =>
    apiV2.get(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`).then((dialogs: any) => dialogs.map((dialog: any) => dialogsAdapter.fromDB(dialog))),
};

export default transcriptClient;
