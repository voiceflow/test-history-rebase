import type { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import type { MutableEntityData, ORMMutateOptions, PKEntity, PKOrEntity } from '@/types';

import type { MutableORM } from './mutable-orm.interface';

export interface TabularORM<Entity extends PKEntity, ConstructorParam extends object>
  extends MutableORM<Entity, ConstructorParam> {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<Entity[]>;

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

  patchOneForUser(
    userID: number,
    id: PKOrEntity<Entity>,
    data: MutableEntityData<Entity>,
    options?: ORMMutateOptions
  ): Promise<void>;

  patchManyForUser(
    userID: number,
    ids: PKOrEntity<Entity>[],
    data: MutableEntityData<Entity>,
    options?: ORMMutateOptions
  ): Promise<void>;
}
