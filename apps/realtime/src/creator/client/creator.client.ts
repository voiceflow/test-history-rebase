import * as fetch from '@voiceflow/fetch';
import undici from 'undici';

import { ProjectClient } from './project.client';
import { ProjectListClient } from './project-list.client';
import { FetchClient } from './types';
import { VersionClient } from './version.client';

export class CreatorClient {
  private readonly client: FetchClient;

  public projectList: ProjectListClient;

  public project: ProjectClient;

  public version: VersionClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });

    this.projectList = new ProjectListClient(this.client);
    this.project = new ProjectClient(this.client);
    this.version = new VersionClient(this.client);
  }
}
