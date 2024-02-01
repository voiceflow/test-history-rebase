/* eslint-disable max-classes-per-file */
import type { PromptEntity } from '@/main';
import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import { PostgresCMSObjectUnionORM } from '@/postgres/common/postgres-union.orm';
import type { PKOrEntity } from '@/types';

import type { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';
import type { AnyResponseVariantEntity } from './response-variant.entity';
import {
  BaseResponseVariantEntity,
  JSONResponseVariantEntity,
  PromptResponseVariantEntity,
  TextResponseVariantEntity,
} from './response-variant.entity';

export class ResponseVariantORM extends PostgresCMSObjectUnionORM(
  BaseResponseVariantEntity,
  JSONResponseVariantEntity,
  TextResponseVariantEntity
) {
  findManyByEnvironment(
    assistant: PKOrEntity<AssistantEntity>,
    environmentID: string
  ): Promise<AnyResponseVariantEntity[]> {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }

  findManyByDiscriminators(
    discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]
  ): Promise<AnyResponseVariantEntity[]> {
    return this.find({ discriminator: discriminators });
  }
}

export class ResponseJSONVariantORM extends PostgresCMSObjectORM(JSONResponseVariantEntity) {
  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    return this.find({ discriminator: discriminators });
  }
}

export class ResponsePromptVariantORM extends PostgresCMSObjectORM(PromptResponseVariantEntity) {
  findManyByPrompts(prompts: PKOrEntity<PromptEntity>[]) {
    return this.find({ prompt: prompts });
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    return this.find({ discriminator: discriminators });
  }
}

export class ResponseTextVariantORM extends PostgresCMSObjectORM(TextResponseVariantEntity) {
  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    return this.find({ discriminator: discriminators });
  }
}
