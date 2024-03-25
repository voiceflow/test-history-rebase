/* eslint-disable max-classes-per-file */
import { PostgresCMSMutableORM } from '@/postgres/common';

import {
  BaseResponseAttachmentEntity,
  ResponseCardAttachmentEntity,
  ResponseMediaAttachmentEntity,
} from './response-attachment.entity';
import type { AnyResponseAttachmentEntity } from './response-attachment.interface';
import {
  BaseResponseAttachmentJSONAdapter,
  ResponseCardAttachmentJSONAdapter,
  ResponseMediaAttachmentJSONAdapter,
} from './response-attachment-json.adapter';

export class ResponseCardAttachmentORM extends PostgresCMSMutableORM<ResponseCardAttachmentEntity> {
  Entity = ResponseCardAttachmentEntity;

  jsonAdapter = ResponseCardAttachmentJSONAdapter;

  findManyByVariants(environmentID: string, variantIDs: string) {
    return this.find({ environmentID, variantID: variantIDs });
  }

  findManyByCardAttachments(environmentID: string, cardIDs: string[]) {
    return this.find({ environmentID, cardID: cardIDs });
  }

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids });
  }
}

export class ResponseMediaAttachmentORM extends PostgresCMSMutableORM<ResponseMediaAttachmentEntity> {
  Entity = ResponseMediaAttachmentEntity;

  jsonAdapter = ResponseMediaAttachmentJSONAdapter;

  findManyByVariants(environmentID: string, variantIDs: string) {
    return this.find({ environmentID, variantID: variantIDs });
  }

  findManyByMediaAttachments(environmentID: string, mediaIDs: string[]) {
    return this.find({ environmentID, mediaID: mediaIDs });
  }

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids });
  }
}

export class AnyResponseAttachmentORM extends PostgresCMSMutableORM<
  BaseResponseAttachmentEntity,
  AnyResponseAttachmentEntity
> {
  Entity = BaseResponseAttachmentEntity;

  jsonAdapter = BaseResponseAttachmentJSONAdapter;

  protected discriminators = [
    { Entity: ResponseCardAttachmentEntity, jsonAdapter: ResponseCardAttachmentJSONAdapter },
    { Entity: ResponseMediaAttachmentEntity, jsonAdapter: ResponseMediaAttachmentJSONAdapter },
  ];

  findManyByVariants(environmentID: string, variantIDs: string[]) {
    return this.find({ environmentID, variantID: variantIDs });
  }

  findManyByAttachments(environmentID: string, attachmentIDs: string[]) {
    return this.qb
      .select('*')
      .where('environment_id', environmentID)
      .andWhere((builder) => builder.whereIn('card_id', attachmentIDs).orWhereIn('media_id', attachmentIDs))
      .then(this.mapFromDB);
  }

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids });
  }
}
