import * as Voiceflow from '@voiceflow/api-sdk';
import * as fetch from '@voiceflow/fetch';
import undici from 'undici';

import { ProjectClient } from './project.client';
import { FetchClient } from './types';

export class CreatorClient {
  private readonly client: FetchClient;

  private readonly voiceflow: Voiceflow.Client;

  public project: ProjectClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });
    // TODO: remove it
    // eslint-disable-next-line no-console
    console.log(this.client);

    // default.default is happening due to ESM modules
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.voiceflow = new (Voiceflow.default?.default ?? Voiceflow.default)({
      clientKey: 'realtime',
      apiEndpoint: `${baseURL}/v2`,
    }).generateClient({ authorization: token });

    this.project = new ProjectClient(this.voiceflow);
  }
}
