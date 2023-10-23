import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, ConditionORM, ResponseDiscriminatorORM, ResponseJSONVariantORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ResponseJSONVariantService extends MutableService<ResponseJSONVariantORM> {
  constructor(
    @Inject(ResponseJSONVariantORM)
    protected readonly orm: ResponseJSONVariantORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(ConditionORM)
    protected readonly conditionORM: ConditionORM,
    @Inject(ResponseDiscriminatorORM)
    protected readonly responseDiscriminatorORM: ResponseDiscriminatorORM
  ) {
    super();
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }
}
