import { SyncService } from './sync';

export * from './manager';
export * from './sync';

export interface BaseServiceMap {
  sync: SyncService;
}
