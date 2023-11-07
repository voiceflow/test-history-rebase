import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';

import { FetchClient } from '../../common/fetch';

export type Fields = readonly string[];

export class ProjectClient {
  static BASE_URL = '/v2/projects';

  constructor(private readonly client: FetchClient) {}

  protected _getFieldsQuery(fields?: Fields): string {
    return fields ? `?fields=${fields.join(',')}` : '';
  }

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
    return this.client.patch(`${ProjectClient.BASE_URL}/${id}/platform`, body).json<P>();
  }

  public async deleteV2(projectID: string): Promise<boolean> {
    return this.client.delete(`${ProjectClient.BASE_URL}/v3/projects/${projectID}`).json<boolean>();
  }

  public async deleteMany(projectIDs: string[]): Promise<boolean> {
    return this.client.post(`${ProjectClient.BASE_URL}/v2/projects/delete-many`, { json: { projectIDs } }).json<boolean>();
  }

  public async list<P extends Partial<BaseModels.Project.Model<AnyRecord, AnyRecord>>>(workspaceID: string, fields: Fields): Promise<P[]>;

  public async list<P extends AnyRecord, M extends AnyRecord>(workspaceID: string): Promise<BaseModels.Project.Model<P, M>[]>;

  public async list<P extends BaseModels.Project.Model<any, any> = BaseModels.Project.Model<AnyRecord, AnyRecord>>(workspaceID: string): Promise<P[]>;

  public async list(
    workspaceID: string,
    fields?: Fields
  ): Promise<BaseModels.Project.Model<any, any>[] | Partial<BaseModels.Project.Model<any, any>>[]> {
    return this.client
      .get(`${ProjectClient.BASE_URL}/workspaces/${workspaceID}/projects${this._getFieldsQuery(fields)}`)
      .json<BaseModels.Project.Model<any, any>[] | Partial<BaseModels.Project.Model<any, any>>[]>();
  }

  public async getCreator<
    P extends BaseModels.Project.Model<any, any> = BaseModels.Project.Model<AnyRecord, AnyRecord>,
    V extends BaseModels.Version.Model<any, any, string> = BaseModels.Version.Model<BaseModels.Version.PlatformData>,
    D extends BaseModels.Diagram.Model<any> = BaseModels.Diagram.Model,
    VS extends BaseModels.VariableState.Model = BaseModels.VariableState.Model
  >(id: string, versionID: string): Promise<{ project: P; version: V; diagrams: D[]; variableStates: VS[] }> {
    return this.client
      .get(`${ProjectClient.BASE_URL}/${id}/creator/${versionID}`)
      .json<{ project: P; version: V; diagrams: D[]; variableStates: VS[] }>();
  }
}
