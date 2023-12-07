import type { AssistantEntity, CMSTabularORM, ORMEntity, ORMParam, PKOrEntity } from '@voiceflow/orm-designer';

import { CMSObjectService } from './cms-object.service';

export abstract class CMSTabularService<Orm extends CMSTabularORM<any, any>> extends CMSObjectService<Orm> {
  protected abstract readonly orm: CMSTabularORM<ORMEntity<Orm>, ORMParam<Orm>>;

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<ORMEntity<Orm>[]> {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }
}
