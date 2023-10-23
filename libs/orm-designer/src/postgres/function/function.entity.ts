import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FunctionPathEntity } from './function-path/function-path.entity';
import { FunctionVariableEntity } from './function-variable/function-variable.entity';

@Entity({ tableName: 'designer.function' })
@Unique({ properties: ['id', 'environmentID'] })
export class FunctionEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<FunctionEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<FunctionEntity, Data>;
  }

  @Property()
  code: string;

  @Property({ default: null })
  image: string | null;

  @OneToMany(() => FunctionPathEntity, (value) => value.function)
  paths = new Collection<FunctionPathEntity>(this);

  @OneToMany(() => FunctionVariableEntity, (value) => value.function)
  variables = new Collection<FunctionVariableEntity>(this);

  @Property({ default: null })
  description: string | null;

  constructor({ code, image, description, ...data }: EntityCreateParams<FunctionEntity>) {
    super(data);

    ({
      code: this.code,
      image: this.image,
      description: this.description,
    } = FunctionEntity.resolveForeignKeys({
      code,
      image,
      description,
    }));
  }
}
