import * as fetch from '@voiceflow/fetch';
import undici from 'undici';

import type { FetchClient } from '../../common/fetch';
import { ProjectClient } from './project.client';
import { VersionClient } from './version.client';

export class CreatorClient {
  private readonly client: FetchClient;

  public project: ProjectClient;

  public version: VersionClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });

    this.project = new ProjectClient(this.client);
    this.version = new VersionClient(this.client);
  }
}
