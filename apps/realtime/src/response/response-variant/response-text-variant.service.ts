import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, ConditionORM, ResponseDiscriminatorORM, ResponseTextVariantORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ResponseTextVariantService extends MutableService<ResponseTextVariantORM> {
  constructor(
    @Inject(ResponseTextVariantORM)
    protected readonly orm: ResponseTextVariantORM,
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

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.orm.deleteManyByAssistant(assistant);
  }
}
