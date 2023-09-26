import * as fetch from '@voiceflow/fetch';
import undici from 'undici';

import { FetchClient } from './types';

export class CreatorClient {
  private readonly client: FetchClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });
  }
}
