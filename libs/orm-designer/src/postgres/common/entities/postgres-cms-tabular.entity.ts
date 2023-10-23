import { ManyToOne, PrimaryKeyType, Property, ref } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import { FolderEntity } from '@/postgres/folder/folder.entity';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { Assistant } from '../decorators/assistant.decorator';
import { CreatedByID } from '../decorators/created-by-id.decorator';
import { Environment } from '../decorators/environment.decorator';
import { UpdatedByID } from '../decorators/updated-by-id.decorator';
import { PostgresCMSObjectEntity } from './postgres-cms-object.entity';

export abstract class PostgresCMSTabularEntity extends PostgresCMSObjectEntity {
  static resolveTabularForeignKeys<
    Entity extends PostgresCMSTabularEntity,
    Data extends ResolveForeignKeysParams<Entity>
  >({ folderID, assistantID, environmentID, ...data }: Data & ResolveForeignKeysParams<PostgresCMSTabularEntity>) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(folderID !== undefined && {
          folder: folderID ? ref(PostgresCMSTabularEntity, { id: folderID, environmentID }) : null,
        }),
      }),
    } as ResolvedForeignKeys<Entity, Data>;
  }

  @Property()
  name: string;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @CreatedByID()
  createdByID: number;

  @UpdatedByID()
  updatedByID: number;

  @Environment()
  environmentID: string;

  @ManyToOne(() => FolderEntity, {
    name: 'folder_id',
    default: null,
    onDelete: 'cascade',
    fieldNames: ['folder_id', 'environment_id'],
  })
  folder: Ref<FolderEntity> | null;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<PostgresCMSTabularEntity>) {
    super(data);

    ({
      name: this.name,
      folder: this.folder,
      assistant: this.assistant,
      createdByID: this.createdByID,
      updatedByID: this.updatedByID,
      environmentID: this.environmentID,
    } = PostgresCMSTabularEntity.resolveTabularForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      folderID: this.folder?.id ?? null,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
