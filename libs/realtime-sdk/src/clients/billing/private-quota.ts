import type { NestResourceOptions } from '../nest';
import { NestResource } from '../nest';

export class PrivateQuota extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/private/quota' });
  }

  public async updateQuotaPlan(workspaceID: string, quotaName: string): Promise<void> {
    await this.put(`/workspace/${workspaceID}/${quotaName}/plandefault`);
  }
}
