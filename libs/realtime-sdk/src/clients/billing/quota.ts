import type { Quota as QuotaType } from '../../models/Billing/Quota';
import type { NestResourceOptions } from '../nest';
import { NestResource } from '../nest';

export class Quota extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/quota' });
  }

  public async deleteWorkspaceQuotas(workspaceID: string) {
    return this.delete(`/workspace/${workspaceID}`);
  }

  public async getWorkspaceQuotas(workspaceID: string): Promise<QuotaType[]> {
    const { data } = await this.get<QuotaType[]>(`/workspace/${workspaceID}`);
    return data;
  }

  public async getQuotaByName(workspaceID: string, quotaName: string): Promise<QuotaType | null> {
    try {
      const { data } = await this.get<QuotaType>(`/workspace/${workspaceID}/${quotaName}`);
      return data;
    } catch (err) {
      return null;
    }
  }
}
