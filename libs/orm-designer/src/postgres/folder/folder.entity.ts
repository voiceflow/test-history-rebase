import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { AssistantEntity } from '../assistant/assistant.entity';
import { Assistant } from '../common/decorators/assistant.decorator';
import { Environment } from '../common/decorators/environment.decorator';
import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';
import { FolderScope } from './folder-scope.enum';

@Entity({ tableName: 'designer.folder' })
@Unique({ properties: ['id', 'environmentID'] })
export class FolderEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<FolderEntity>>({
    parentID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(parentID !== undefined && { parent: parentID ? ref(FolderEntity, { id: parentID, environmentID }) : null }),
      }),
    } as ResolvedForeignKeys<FolderEntity, Data>;
  }

  @Property()
  name: string;

  @Enum(() => FolderScope)
  scope: FolderScope;

  @ManyToOne(() => FolderEntity, {
    name: 'parent_id',
    default: null,
    onDelete: 'cascade',
    fieldNames: ['parent_id', 'environment_id'],
  })
  parent: Ref<FolderEntity> | null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<FolderEntity>) {
    super(data);

    ({
      name: this.name,
      scope: this.scope,
      parent: this.parent,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = FolderEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      parentID: this.parent?.id ?? null,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
