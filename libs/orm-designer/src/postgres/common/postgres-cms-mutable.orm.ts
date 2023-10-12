import type { Constructor, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import type { PostgresCMSCreatableEntity } from './entities/postgres-cms-creatable.entity';
import { PostgresMutableORM } from './postgres-mutable.orm';

export const PostgresCMSMutableORM = <Entity extends PostgresCMSCreatableEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    resolveForeignKeys: (
      data: ResolveForeignKeysParams<Entity>
    ) => ResolvedForeignKeys<Entity, ResolveForeignKeysParams<Entity>>;
  }
) => class extends PostgresMutableORM<Entity, ConstructorParam>(Entity) {};
