import { Entity, PrimaryKey, wrap } from '@mikro-orm/core';

@Entity({ tableName: 'identity.user' })
export class UserStubEntity {
  @PrimaryKey()
  id!: number;

  toJSON(...args: any[]) {
    return wrap(this).toObject(...args);
  }
}
