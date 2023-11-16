import type { Ref } from '@mikro-orm/core';
import { Entity, OneToOne, Property, Unique, wrap } from '@mikro-orm/core';

import { PostgresEntity } from '@/postgres/common';
import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../stubs/user.stub';
import { ProductUpdateJSONAdapter } from './product-update.adapter';

@Entity({ schema: 'public', tableName: 'product_updates' })
@Unique({ properties: ['id'] })
export class ProductUpdateEntity extends PostgresEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ProductUpdateEntity>>>(data: JSON) {
    return ProductUpdateJSONAdapter.toDB<JSON>(data);
  }

  @Property({ name: 'type', nullable: true, type: 'varchar', length: 255 })
  type: string | null = null;

  @Property({ defaultRaw: 'now()', nullable: true, type: 'timestamptz' })
  created: Date | null = null;

  @Property({ name: 'details', nullable: true, type: 'text' })
  details: string | null = null;

  @OneToOne(() => UserStubEntity, { name: 'creator_id' })
  creator: Ref<UserStubEntity> | null = null;

  constructor({
    created = new Date().toJSON(),
    ...data
  }: Omit<EntityCreateParams<ProductUpdateEntity>, 'created'> &
    Partial<Pick<ToJSONWithForeignKeys<ProductUpdateEntity>, 'created'>>) {
    super();

    ({
      type: this.type,
      created: this.created,
      details: this.details,
      creator: this.creator,
    } = ProductUpdateEntity.fromJSON({ ...data, created }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ProductUpdateEntity> {
    return ProductUpdateJSONAdapter.fromDB({
      ...wrap<ProductUpdateEntity>(this).toObject(...args),
      creator: this.creator,
    });
  }
}
