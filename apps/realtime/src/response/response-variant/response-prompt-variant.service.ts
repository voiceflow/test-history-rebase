import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity, PromptEntity } from '@voiceflow/orm-designer';
import { AssistantORM, ConditionORM, PromptORM, ResponseDiscriminatorORM, ResponsePromptVariantORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class ResponsePromptVariantService extends CMSObjectService<ResponsePromptVariantORM> {
  constructor(
    @Inject(ResponsePromptVariantORM)
    protected readonly orm: ResponsePromptVariantORM,
    @Inject(PromptORM)
    protected readonly promptORM: PromptORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(ConditionORM)
    protected readonly conditionORM: ConditionORM,
    @Inject(ResponseDiscriminatorORM)
    protected readonly responseDiscriminatorORM: ResponseDiscriminatorORM
  ) {
    super();
  }

  findManyByPrompts(prompts: PKOrEntity<PromptEntity>[]) {
    return this.orm.findManyByPrompts(prompts);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }
}
