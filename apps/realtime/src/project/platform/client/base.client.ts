import { BaseModels } from '@voiceflow/base-types';
import * as fetch from '@voiceflow/fetch';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import undici from 'undici';

import { FetchClient } from '@/common/fetch';

export abstract class BaseProjectPlatformClient<P extends BaseModels.Project.Model<any, any>> {
  private readonly client: FetchClient;

  constructor(baseURL: string, token: string) {
    this.client = new fetch.FetchClient(undici.fetch, { baseURL, headers: { authorization: token } });
  }

  public async duplicate<D extends P>(
    projectID: string,
    data: Partial<Omit<Realtime.DBProject, '_id' | 'creatorID'>>,
    params?: Record<string, string>
  ) {
    return this.client.post(`/project/${projectID}/copy?${new URLSearchParams(params).toString()}`, { json: data }).json<D>();
  }
}
