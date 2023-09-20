import { Inject, Injectable } from '@nestjs/common';
import { AssistantORM, EntityORM, FolderORM } from '@voiceflow/orm-designer';

import { TabularService } from '@/common';

@Injectable()
export class EntityService extends TabularService<EntityORM> {
  constructor(
    @Inject(EntityORM)
    protected readonly orm: EntityORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM
  ) {
    super();
  }

  public async getTest(projectID: string) {
    try {
      const ormManager = this.assistantORM.em.getContext();
      // eslint-disable-next-line no-console
      console.log('ENTITY SERVICE', { projectID, ormManager });
      return [];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    return [];
  }
}
