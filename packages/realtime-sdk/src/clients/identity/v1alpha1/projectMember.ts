import * as Models from '@realtime-sdk/models';
import { UserRole } from '@voiceflow/internal';

import { NestResource, NestResourceOptions } from '../../nest';

export class ProjectMember extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/project-member' });
  }

  public async listForWorkspace(workspaceID: string): Promise<Models.Identity.ProjectMember[]> {
    const { data } = await this.get<Models.Identity.ProjectMember[]>(`/workspace/${workspaceID}`);

    return data;
  }

  public async list(projectID: string): Promise<Models.Identity.ProjectMember[]> {
    const { data } = await this.get<Models.Identity.ProjectMember[]>(`/${projectID}`);

    return data;
  }

  public async create(projectID: string, payload: { role: UserRole.VIEWER | UserRole.EDITOR; userID: number }): Promise<void> {
    await this.post(`/${projectID}`, payload);
  }

  public async createMany(projectID: string, payload: { role: UserRole.VIEWER | UserRole.EDITOR; userID: number }[]): Promise<void> {
    await this.post(`/${projectID}/batch`, payload);
  }

  public async update(projectID: string, userID: number, payload: { role: UserRole.VIEWER | UserRole.EDITOR }): Promise<void> {
    await this.patch(`/${projectID}/${userID}`, payload);
  }

  public async remove(projectID: string, userID: number): Promise<void> {
    await this.delete(`/${projectID}/${userID}`);
  }
}
