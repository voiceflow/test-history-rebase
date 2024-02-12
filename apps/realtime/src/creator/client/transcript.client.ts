import type { FetchClient } from '../../common/fetch';

export class TranscriptClient {
  static BASE_URL = '/v2/transcripts';

  constructor(private readonly client: FetchClient) {}

  public async getHasUnreadTranscripts(projectID: string) {
    return this.client
      .get(`${TranscriptClient.BASE_URL}/${projectID}/hasUnreadTranscripts`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .json<boolean>()
      .catch(() => false);
  }
}
