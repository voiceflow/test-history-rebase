import type { FolderEntity } from '@/main';
import type { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import type { ORMMutateOptions, PKEntity, PKOrEntity } from '@/types';

import type { CMSObjectORM } from './cms-object-orm.interface';

export interface CMSTabularORM<Entity extends PKEntity, ConstructorParam extends object>
  extends CMSObjectORM<Entity, ConstructorParam> {
  findManyByFolders(folders: PKOrEntity<FolderEntity>[]): Promise<Entity[]>;

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<Entity[]>;

  createOneForUser(
    userID: number,
    data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>,
    options?: ORMMutateOptions
  ): Promise<Entity>;

  createManyForUser(
    userID: number,
    data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>[],
    options?: ORMMutateOptions
  ): Promise<Entity[]>;

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<void>;
}
