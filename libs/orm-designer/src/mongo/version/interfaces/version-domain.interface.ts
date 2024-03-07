import type { VersionDomain as BaseVersionDomain } from '@voiceflow/dtos';

export interface VersionDomain extends Omit<BaseVersionDomain, 'updatedAt'> {
  updatedAt?: Date;
}
