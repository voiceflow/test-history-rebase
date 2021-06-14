import { Transcript } from '@/models';

import fetch from './fetch';

export const TRANSCRIPT_PATH = 'transcript';

const transcriptClient = {
  find: (projectID: string, queryParams?: string) =>
    fetch.get<{ transcripts: Transcript[] }>(`${TRANSCRIPT_PATH}/${projectID}?${queryParams}`).then(({ transcripts }) => transcripts),
};

export default transcriptClient;
