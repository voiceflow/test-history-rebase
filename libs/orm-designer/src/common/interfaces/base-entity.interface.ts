import type { EntityDTO } from '@mikro-orm/core';

export interface BaseEntity {
  id: string | number;

  toJSON(...args: any[]): EntityDTO<this>;
}
