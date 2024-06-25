import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class Organization extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/organization' });
  }

  public async updateImage(organizationID: string, payload: unknown): Promise<{ image: string }> {
    const { data } = await this.put<{ image: string }>(`/${organizationID}/image`, payload);

    return data;
  }
}
