import * as fetch from '@voiceflow/fetch';
import undici from 'undici';

import { ProjectListClient } from './project-list.client';
import { FetchClient } from './types';

export class CreatorClient {
  private readonly client: FetchClient;

  public projectList: ProjectListClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });

    this.projectList = new ProjectListClient(this.client);
  }
}
