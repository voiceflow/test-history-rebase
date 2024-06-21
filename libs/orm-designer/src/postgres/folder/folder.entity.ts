import { Entity, Enum, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { FolderScope } from '@voiceflow/dtos';

import type { CMSCompositePK, Ref } from '@/types';

import type { AssistantEntity } from '../assistant/assistant.entity';
import { Assistant } from '../common/decorators/assistant.decorator';
import { Environment } from '../common/decorators/environment.decorator';
import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';

@Entity({ tableName: 'designer.folder' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class FolderEntity extends PostgresCMSObjectEntity<'parent'> {
  @Property()
  name!: string;

  @Enum(() => FolderScope)
  scope!: FolderScope;

  @ManyToOne(() => FolderEntity, {
    name: 'parent_id',
    default: null,
    onDelete: 'cascade',
    nullable: true,
    fieldNames: ['parent_id', 'environment_id'],
  })
  parent!: Ref<FolderEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}
