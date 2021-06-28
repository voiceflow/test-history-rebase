import { TagType, Transcript } from '@/models';

import { apiV2 } from './fetch';

export const TRANSCRIPT_PATH = 'transcripts';

const transcriptClient = {
  find: (projectID: string, queryParams?: string) =>
    apiV2.get<{ transcripts: Transcript[] }>(`${TRANSCRIPT_PATH}/${projectID}?${queryParams}`).then(({ transcripts }) => transcripts),

  patchTranscript: (projectID: string, transcriptID: string, data: { notes?: string; tags?: TagType; unread?: boolean }) =>
    apiV2.patch<Transcript>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`, { data }).then((transcript) => transcript),

  deleteTranscript: (projectID: string, transcriptID: string) => apiV2.delete(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`),
};

export default transcriptClient;
