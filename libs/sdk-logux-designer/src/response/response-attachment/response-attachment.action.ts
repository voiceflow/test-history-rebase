import { Utils } from '@voiceflow/common';
import type { AnyResponseAttachment, ResponseCardAttachment, ResponseMediaAttachment } from '@voiceflow/dtos';
import { AttachmentType } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddManyRequest,
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';
import type { DesignerAction } from '@/types';

const responseAttachmentAction = createCRUD('response_attachment');

interface BaseCreateData {
  variantID: string;
}

export interface CreateCardData extends BaseCreateData {
  cardID: string;
}

export interface CreateMediaData extends BaseCreateData {
  mediaID: string;
}

export interface ReplaceCardData extends BaseCreateData {
  oldCardID: string;
  attachmentID: string;
}

export interface ReplaceMediaData extends BaseCreateData {
  oldMediaID: string;
  attachmentID: string;
}

/**
 * user-sent events
 */

/* CreateCardOne */

export namespace CreateCardOne {
  export interface Request extends DesignerAction {
    data: CreateCardData;
  }

  export interface Response extends CreateResponse<ResponseCardAttachment>, DesignerAction {}
}

export const CreateCardOne = responseAttachmentAction.crud.createOne<CreateCardOne.Request, CreateCardOne.Response>(
  AttachmentType.CARD
);

/* CreateMediaOne */

export namespace CreateMediaOne {
  export interface Request extends DesignerAction {
    data: CreateMediaData;
  }

  export interface Response extends CreateResponse<ResponseMediaAttachment>, DesignerAction {}
}

export const CreateMediaOne = responseAttachmentAction.crud.createOne<CreateMediaOne.Request, CreateMediaOne.Response>(
  AttachmentType.MEDIA
);

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = responseAttachmentAction.crud.deleteOne<DeleteOne>();

/* ReplaceOneCard */

export interface ReplaceOneCard extends ReplaceCardData, DesignerAction {}

export const ReplaceOneCard = Utils.protocol.createAction<ReplaceOneCard>(responseAttachmentAction('REPLACE_ONE_CARD'));

/* ReplaceOneMedia */

export interface ReplaceOneMedia extends ReplaceMediaData, DesignerAction {}

export const ReplaceOneMedia = Utils.protocol.createAction<ReplaceOneMedia>(
  responseAttachmentAction('REPLACE_ONE_MEDIA')
);

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = responseAttachmentAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<AnyResponseAttachment>, DesignerAction {}

export const Replace = responseAttachmentAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<AnyResponseAttachment>, DesignerAction {}

export const AddOne = responseAttachmentAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<AnyResponseAttachment>, DesignerAction {}

export const AddMany = responseAttachmentAction.crud.addMany<AddMany>();
