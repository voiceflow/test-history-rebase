import type { BaseResource } from './base-resource.interface';

export interface ObjectResource extends BaseResource {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
