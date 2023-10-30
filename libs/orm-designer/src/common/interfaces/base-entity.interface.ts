import type { ToJSON } from '@/types';

export interface BaseEntity {
  id: string | number;

  toJSON(): ToJSON<BaseEntity>;
}
