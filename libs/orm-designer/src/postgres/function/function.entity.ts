import { Collection, Entity, Index, OneToMany, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FunctionEntityAdapter } from './function-entity.adapter';
import type { FunctionPathEntity } from './function-path/function-path.entity';
import type { FunctionVariableEntity } from './function-variable/function-variable.entity';

@Entity({ tableName: 'designer.function' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class FunctionEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<FunctionEntity>>>(data: JSON) {
    return FunctionEntityAdapter.toDB<JSON>(data);
  }

  @Property({ type: 'text' })
  code: string;

  @Property({ default: null, nullable: true })
  image: string | null;

  @OneToMany('FunctionPathEntity', (value: FunctionPathEntity) => value.function)
  paths = new Collection<FunctionPathEntity>(this);

  @OneToMany('FunctionVariableEntity', (value: FunctionVariableEntity) => value.function)
  variables = new Collection<FunctionVariableEntity>(this);

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  constructor({ code, image, description, ...data }: EntityCreateParams<FunctionEntity>) {
    super(data);

    ({
      code: this.code,
      image: this.image,
      description: this.description,
    } = FunctionEntity.fromJSON({ code, image, description }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<FunctionEntity> {
    return FunctionEntityAdapter.fromDB({
      ...wrap<FunctionEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}
