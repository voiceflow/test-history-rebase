import { ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import { FolderEntity } from '@/postgres/folder/folder.entity';
import type { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { CMSCompositePK, EntityCreateParams, Ref } from '@/types';

import { PostgresCMSTabularEntityAdapter } from '../adapters/postgres-cms-tabular-entity.adapter';
import { Assistant } from '../decorators/assistant.decorator';
import { CreatedByID } from '../decorators/created-by-id.decorator';
import { Environment } from '../decorators/environment.decorator';
import { UpdatedByID } from '../decorators/updated-by-id.decorator';
import { PostgresCMSObjectEntity } from './postgres-cms-object.entity';

export abstract class PostgresCMSTabularEntity extends PostgresCMSObjectEntity {
  @Property()
  name: string;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @UpdatedByID()
  updatedBy: Ref<UserStubEntity>;

  @CreatedByID()
  createdBy: Ref<UserStubEntity>;

  @Environment()
  environmentID: string;

  @ManyToOne(() => FolderEntity, {
    name: 'folder_id',
    default: null,
    onDelete: 'cascade',
    nullable: true,
    fieldNames: ['folder_id', 'environment_id'],
  })
  folder: Ref<FolderEntity> | null = null;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<PostgresCMSTabularEntity>) {
    super(data);

    ({
      name: this.name,
      folder: this.folder,
      assistant: this.assistant,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      environmentID: this.environmentID,
    } = PostgresCMSTabularEntityAdapter.toDB(data));
  }
}
