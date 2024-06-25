import type * as Models from '@realtime-sdk/models';
import type { ProjectUserRole } from '@voiceflow/dtos';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

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

  public async create(projectID: string, payload: { role: ProjectUserRole; userID: number }): Promise<void> {
    await this.post(`/${projectID}`, payload);
  }

  public async createMany(projectID: string, payload: { role: ProjectUserRole; userID: number }[]): Promise<void> {
    await this.post(`/${projectID}/batch`, payload);
  }

  public async update(projectID: string, userID: number, payload: { role: ProjectUserRole }): Promise<void> {
    await this.patch(`/${projectID}/${userID}`, payload);
  }

  public async remove(projectID: string, userID: number): Promise<void> {
    await this.delete(`/${projectID}/${userID}`);
  }
}
