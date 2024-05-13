import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { FolderScope } from '@voiceflow/dtos';

import type { CMSCompositePK, Ref } from '@/types';

import type { AssistantEntity } from '../assistant/assistant.entity';
import { Assistant } from '../common/decorators/assistant.decorator';
import { Environment } from '../common/decorators/environment.decorator';
import { ObjectIDPrimaryKey } from '../common/decorators/object-id-primary-key.decorator';
import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';

@Entity({ tableName: 'designer.folder' })
export class FolderEntity extends PostgresCMSObjectEntity<'parent'> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Enum(() => FolderScope)
  scope!: FolderScope;

  @ManyToOne(() => FolderEntity, {
    name: 'parent_id',
    default: null,
    onDelete: 'cascade',
    nullable: true,
    fieldNames: ['environment_id', 'parent_id'],
  })
  parent!: Ref<FolderEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}
