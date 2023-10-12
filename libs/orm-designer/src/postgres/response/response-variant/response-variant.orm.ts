/* eslint-disable max-classes-per-file */
import type { PromptEntity } from '@/main';
import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSMutableORM, PostgresCMSUnionORM } from '@/postgres/common';
import type { PKOrEntity } from '@/types';

import type { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';
import type { AnyResponseVariantEntity } from './response-variant.entity';
import {
  BaseResponseVariantEntity,
  JSONResponseVariantEntity,
  PromptResponseVariantEntity,
  TextResponseVariantEntity,
} from './response-variant.entity';

export class ResponseVariantORM extends PostgresCMSUnionORM(
  BaseResponseVariantEntity,
  JSONResponseVariantEntity,
  TextResponseVariantEntity,
  PromptResponseVariantEntity
) {
  findManyByAssistant(
    assistant: PKOrEntity<AssistantEntity>,
    environmentID: string
  ): Promise<AnyResponseVariantEntity[]> {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(BaseResponseVariantEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }

  findManyByDiscriminators(
    discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]
  ): Promise<AnyResponseVariantEntity[]> {
    return this.find({ discriminator: discriminators });
  }
}

export class ResponseJSONVariantORM extends PostgresCMSMutableORM(JSONResponseVariantEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(JSONResponseVariantEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    return this.find({ discriminator: discriminators });
  }
}

export class ResponsePromptVariantORM extends PostgresCMSMutableORM(PromptResponseVariantEntity) {
  findManyByPrompts(prompts: PKOrEntity<PromptEntity>[]) {
    return this.find({ prompt: prompts });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(PromptResponseVariantEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    return this.find({ discriminator: discriminators });
  }
}

export class ResponseTextVariantORM extends PostgresCMSMutableORM(TextResponseVariantEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(TextResponseVariantEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    return this.find({ discriminator: discriminators });
  }
}
