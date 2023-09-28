import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';

import { FetchClient } from './types';

export class ProjectClient {
  static BASE_URL = '/v2/projects';

  constructor(private readonly client: FetchClient) {}

  public async get<P extends Partial<BaseModels.Project.Model<AnyRecord, AnyRecord>>>(id: string, fields: string[]): Promise<P>;

  public async get<P extends AnyRecord, M extends AnyRecord>(id: string): Promise<BaseModels.Project.Model<P, M>>;

  public async get<P extends BaseModels.Project.Model<any, any> = BaseModels.Project.Model<AnyRecord, AnyRecord>>(id: string): Promise<P>;

  public async get(id: string): Promise<BaseModels.Project.Model<any, any> | Partial<BaseModels.Project.Model<any, any>>> {
    return this.client.get(`${ProjectClient.BASE_URL}/${id}`).json();
  }

  public async update<P extends AnyRecord, M extends AnyRecord>(
    id: string,
    body: Partial<BaseModels.Project.Model<P, M>>
  ): Promise<Partial<BaseModels.Project.Model<P, M>>>;

  public async update<P extends Partial<BaseModels.Project.Model<any, any>>>(id: string, body: P): Promise<P>;

  public async update(id: string, data: Partial<BaseModels.Project.Model<any, any>>): Promise<Partial<BaseModels.Project.Model<any, any>>> {
    return this.client.patch(`${ProjectClient.BASE_URL}/${id}`, { json: data }).json<Partial<Partial<BaseModels.Project.Model<any, any>>>>();
  }

  public async updatePlatformData<P extends Partial<AnyRecord>>(id: string, body: P): Promise<P> {
    return this.client.patch(`${ProjectClient.BASE_URL}/platform`, body).json<P>();
  }
}
