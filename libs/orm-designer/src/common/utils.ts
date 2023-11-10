import { Utils } from '@mikro-orm/core';

import type { EntityPKValue, PKOrEntity } from '@/types';

export const isEntity = <Entity extends { id: EntityPKValue }>(entity: PKOrEntity<Entity>): entity is Entity =>
  Utils.isEntity(entity);
