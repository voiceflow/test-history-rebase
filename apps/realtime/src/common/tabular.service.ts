import type {
  AssistantEntity,
  AssistantORM,
  FolderORM,
  ORMEntity,
  ORMMutateOptions,
  ORMParam,
  PKOrEntity,
  TabularORM,
} from '@voiceflow/orm-designer';

import { MutableService } from './mutable.service';
import type { CreateManyForUserData, CreateOneForUserData, PatchManyForUserData, PatchOneForUserData } from './types';

export abstract class TabularService<Orm extends TabularORM<any, any>> extends MutableService<Orm> {
  protected abstract readonly orm: TabularORM<ORMEntity<Orm>, ORMParam<Orm>>;

  protected abstract readonly folderORM: FolderORM;

  protected abstract readonly assistantORM: AssistantORM;

  createOneForUser(userID: number, data: CreateOneForUserData<Orm>, options?: ORMMutateOptions) {
    return this.orm.createOneForUser(userID, data, options);
  }

  createManyForUser(userID: number, data: CreateManyForUserData<Orm>, options?: ORMMutateOptions) {
    return this.orm.createManyForUser(userID, data, options);
  }

  patchOneForUser(userID: number, id: string, data: PatchOneForUserData<Orm>, options?: ORMMutateOptions) {
    return this.orm.patchOneForUser(userID, id, data, options);
  }

  patchManyForUser(userID: number, ids: string[], data: PatchManyForUserData<Orm>, options?: ORMMutateOptions) {
    return this.orm.patchManyForUser(userID, ids, data, options);
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.orm.findManyByAssistant(assistant);
  }
}
