import { Entity, PrimaryKey, wrap } from '@mikro-orm/core';

@Entity({ tableName: 'identity.workspace' })
export class WorkspaceStubEntity {
  @PrimaryKey()
  id!: number;

  toJSON(...args: any[]) {
    return wrap(this).toObject(...args);
  }
}
