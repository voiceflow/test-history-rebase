import type { Constructor, PKEntity } from '@/types';

import type { PostgresCMSCreatableEntity } from './entities/postgres-cms-creatable.entity';
import { PostgresCMSMutableORM } from './postgres-cms-mutable.orm';

type UnionEntity<UnionEntityConstructors extends Constructor<any, any>[]> = PostgresCMSCreatableEntity &
  InstanceType<UnionEntityConstructors[number]>;

export const PostgresCMSUnionORM = <
  Entity extends PKEntity & PostgresCMSCreatableEntity,
  ConstructorParam extends object,
  UnionEntityConstructors extends Constructor<any, any>[]
>(
  Entity: Constructor<[data: ConstructorParam], Entity>,
  ..._: UnionEntityConstructors
) => class extends PostgresCMSMutableORM<UnionEntity<UnionEntityConstructors>, ConstructorParam>(Entity as any) {};

export type PostgresCMSUnionORM<
  Entity extends PostgresCMSCreatableEntity,
  ConstructorParam extends object,
  UnionEntityConstructors extends Constructor<any, any>[]
> = InstanceType<ReturnType<typeof PostgresCMSUnionORM<Entity, ConstructorParam, UnionEntityConstructors>>>;
