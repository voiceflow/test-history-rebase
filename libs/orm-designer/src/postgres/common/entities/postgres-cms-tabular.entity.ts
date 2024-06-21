import { ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import { FolderEntity } from '@/postgres/folder/folder.entity';
import type { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { CMSCompositePK, Ref, ToJSON, ToObject } from '@/types';

import { Assistant } from '../decorators/assistant.decorator';
import { CreatedByID } from '../decorators/created-by-id.decorator';
import { Environment } from '../decorators/environment.decorator';
import { UpdatedByID } from '../decorators/updated-by-id.decorator';
import { PostgresCMSObjectEntity } from './postgres-cms-object.entity';

export abstract class PostgresCMSTabularEntity<
  DefaultOrNullColumn extends string = never,
> extends PostgresCMSObjectEntity<DefaultOrNullColumn | 'folder'> {
  @Property()
  name!: string;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @UpdatedByID()
  updatedBy!: Ref<UserStubEntity>;

  @CreatedByID()
  createdBy!: Ref<UserStubEntity>;

  @Environment()
  environmentID!: string;

  @ManyToOne(() => FolderEntity, {
    name: 'folder_id',
    default: null,
    onDelete: 'cascade',
    nullable: true,
    fieldNames: ['folder_id', 'environment_id'],
  })
  folder!: Ref<FolderEntity> | null;

  [PrimaryKeyProp]?: CMSCompositePK;
}
export type PostgresCMSTabularObject = ToObject<PostgresCMSTabularEntity>;
export type PostgresCMSTabularJSON = ToJSON<PostgresCMSTabularObject>;
