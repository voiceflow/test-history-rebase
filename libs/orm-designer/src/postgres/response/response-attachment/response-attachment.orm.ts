/* eslint-disable max-classes-per-file */
import type { CardAttachmentEntity, MediaAttachmentEntity } from '@/main';
import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSMutableORM, PostgresCMSUnionORM } from '@/postgres/common';
import type { PKOrEntity } from '@/types';

import type { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';
import type { AnyResponseAttachmentEntity } from './response-attachment.entity';
import {
  BaseResponseAttachmentEntity,
  ResponseCardAttachmentEntity,
  ResponseMediaAttachmentEntity,
} from './response-attachment.entity';

export class ResponseAttachmentORM extends PostgresCMSUnionORM(
  BaseResponseAttachmentEntity,
  ResponseCardAttachmentEntity,
  ResponseMediaAttachmentEntity
) {
  findManyByVariants(variants: PKOrEntity<BaseResponseVariantEntity>[]): Promise<AnyResponseAttachmentEntity[]> {
    return this.find({ variant: variants });
  }

  findManyByAssistant(
    assistant: PKOrEntity<AssistantEntity>,
    environmentID: string
  ): Promise<AnyResponseAttachmentEntity[]> {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(BaseResponseAttachmentEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }
}

export class ResponseCardAttachmentORM extends PostgresCMSMutableORM(ResponseCardAttachmentEntity) {
  findManyByVariants(variants: PKOrEntity<BaseResponseVariantEntity>[]) {
    return this.find({ variant: variants });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(ResponseCardAttachmentEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }

  findManyByCardAttachments(cards: PKOrEntity<CardAttachmentEntity>[]) {
    return this.find({ card: cards });
  }
}

export class ResponseMediaAttachmentORM extends PostgresCMSMutableORM(ResponseMediaAttachmentEntity) {
  findManyByVariants(variants: PKOrEntity<BaseResponseVariantEntity>[]) {
    return this.find({ variant: variants });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(ResponseMediaAttachmentEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }

  findManyByMediaAttachments(medias: PKOrEntity<MediaAttachmentEntity>[]) {
    return this.find({ media: medias });
  }
}
