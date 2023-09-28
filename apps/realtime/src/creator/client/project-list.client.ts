import * as Realtime from '@voiceflow/realtime-sdk';

import { FetchClient } from './types';

export class ProjectListClient {
  constructor(private readonly client: FetchClient) {}

  async getAll(workspaceID: string) {
    return this.client
      .get(`/team/${workspaceID}/projectLists`)
      .json<{ projectLists: Realtime.DBProjectList[] }>()
      .then(({ projectLists }) => projectLists.map(({ projects = [], ...projectList }) => ({ projects, ...projectList })));
  }

  async replaceAll(workspaceID: string, projectLists: Realtime.DBProjectList[]) {
    await this.client.patch(`/team/${workspaceID}/projectLists`, { json: { projectLists } });
  }
}
