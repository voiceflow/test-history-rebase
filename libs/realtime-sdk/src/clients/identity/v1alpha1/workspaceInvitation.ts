import type * as Models from '@realtime-sdk/models';
import type { UserRole } from '@voiceflow/internal';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class WorkspaceInvitation extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/workspace-invitation' });
  }

  public async list(workspaceID: string): Promise<Models.Identity.WorkspaceInvite[]> {
    const { data } = await this.get<Models.Identity.WorkspaceInvite[]>(`/${workspaceID}`);

    return data;
  }

  public async getInviteLink(workspaceID: string, userRole?: UserRole): Promise<{ url: string }> {
    const { data } = await this.get<{ url: string }>(`/${workspaceID}/link`, { params: { role: userRole } });

    return data;
  }

  public async acceptInvite(token: string): Promise<{ workspaceID: string }> {
    const { data } = await this.post<{ workspaceID: string }>(`/accept/${token}`);

    return data;
  }

  public async checkInvite(token: string): Promise<boolean> {
    await this.head(`/accept/${token}`);
    return true;
  }

  public async sendInvitation(
    workspaceID: string,
    email: string,
    role: UserRole
  ): Promise<Models.Identity.WorkspaceInvite | null> {
    const { data } = await this.post<Models.Identity.WorkspaceInvite>(`/${workspaceID}`, { email, role });
    return data;
  }

  public async cancelInvite(workspaceID: string, email: string): Promise<void> {
    await this.post<void>(`/${workspaceID}/delete`, { email });
  }

  public async updateInvitation(workspaceID: string, email: string, userRole?: UserRole): Promise<void> {
    await this.patch<void>(`/${workspaceID}`, { email, role: userRole });
  }
}
