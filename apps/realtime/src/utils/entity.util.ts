import type { BaseEntity } from '@voiceflow/orm-designer';

export const cloneEntity = <Entity extends BaseEntity>(
  entity: Entity,
  overrides?: Partial<ReturnType<Entity['toJSON']>>
): ReturnType<Entity['toJSON']> => ({ ...entity.toJSON(), ...overrides } as ReturnType<Entity['toJSON']>);

export const cloneManyEntities = <Entity extends BaseEntity>(
  entities: Entity[],
  overrides?: Partial<ReturnType<Entity['toJSON']>>
): ReturnType<Entity['toJSON']>[] => entities.map((entity) => cloneEntity(entity, overrides));
