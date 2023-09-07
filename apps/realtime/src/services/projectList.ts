import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class ProjectListService extends AbstractControl {
  public async getAll(creatorID: number, workspaceID: string): Promise<Realtime.DBProjectList[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.projectList.getAll(workspaceID);
  }

  public async getDefault(creatorID: number, workspace: string): Promise<Realtime.DBProjectList | null> {
    const projectLists = await this.getAll(creatorID, workspace);

    return projectLists.find((list) => list.name === Realtime.DEFAULT_PROJECT_LIST_NAME) ?? null;
  }

  public async replaceAll(creatorID: number, workspaceID: string, projectLists: Realtime.DBProjectList[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.projectList.replaceAll(workspaceID, projectLists);
  }
}

export default ProjectListService;
