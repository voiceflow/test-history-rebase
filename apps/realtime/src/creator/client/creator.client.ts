import * as fetch from '@voiceflow/fetch';
import undici from 'undici';

import { ProjectClient } from './project.client';
import { FetchClient } from './types';

export class CreatorClient {
  private readonly client: FetchClient;

  public project: ProjectClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });

    this.project = new ProjectClient(this.client);
  }
}
