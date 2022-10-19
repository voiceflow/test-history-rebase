import * as Models from '@realtime-sdk/models';
import { UserRole } from '@voiceflow/internal';

import { Resource, ResourceOptions } from '../resource';

export class WorkspaceInvitation extends Resource {
  constructor(options: ResourceOptions) {
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

  public async acceptInvite(token: string): Promise<string> {
    const { data } = await this.post<string>(`/accept/${token}`);

    return data;
  }

  public async checkInvite(token: string): Promise<boolean> {
    await this.head(`/accept/${token}`);
    return true;
  }

  public async sendInvitation(workspaceID: string, email: string, userRole?: UserRole): Promise<Models.Identity.WorkspaceInvite> {
    const { data } = await this.post<Models.Identity.WorkspaceInvite>(`/${workspaceID}`, { email, role: userRole });
    return data;
  }

  public async cancelInvite(workspaceID: string, email: string): Promise<void> {
    await this.post<void>(`/${workspaceID}/delete`, { email });
  }
}
