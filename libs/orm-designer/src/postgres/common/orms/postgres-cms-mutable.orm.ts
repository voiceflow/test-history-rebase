import type { Constructor, EntityObject, MutableEntityData } from '@/types';

import type { PostgresCMSCreatableEntity } from '../entities/postgres-cms-creatable.entity';
import { PostgresMutableORM } from './postgres-mutable.orm';

export const PostgresCMSMutableORM = <Entity extends PostgresCMSCreatableEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: Partial<MutableEntityData<Entity>>) => Partial<EntityObject<Entity>>;
  }
) => class extends PostgresMutableORM<Entity, ConstructorParam>(Entity) {};
