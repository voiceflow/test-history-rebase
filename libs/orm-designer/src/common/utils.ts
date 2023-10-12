import type { EntityPKValue, PKOrEntity } from '@/types';

export const isEntity = <Entity extends { id: EntityPKValue }>(entity: PKOrEntity<Entity>): entity is Entity =>
  typeof entity === 'object' && Array.isArray(entity) === false;
