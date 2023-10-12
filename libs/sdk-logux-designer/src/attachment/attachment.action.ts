import type { Markup } from '@/common';
import { createCRUD } from '@/crud/crud.action';
import type {
  AddManyRequest,
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';
import type { DesignerAction } from '@/types';

import type { AnyAttachment, CardAttachment, MediaAttachment } from './attachment.interface';
import { AttachmentType } from './attachment-type.enum';
import type { MediaDatatype } from './media-datatype.enum';

const attachmentAction = createCRUD('attachment');

export interface PatchCardData {
  title?: Markup;
  mediaID?: string | null;
  description?: Markup;
  buttonOrder?: string[];
}

export interface PatchMediaData {
  name?: string;
  datatype?: MediaDatatype;
}

export interface CreateCardData {
  title: Markup;
  mediaID: string | null;
  description: Markup;
  buttonOrder: string[];
}

export interface CreateMediaData {
  url: Markup;
  name: string;
  isAsset: boolean;
  datatype: MediaDatatype;
}

/**
 * user-sent events
 */

/* CreateCardOne */

export namespace CreateCardOne {
  export interface Request extends DesignerAction {
    data: CreateCardData;
  }

  export interface Response extends CreateResponse<CardAttachment>, DesignerAction {}
}

export const CreateCardOne = attachmentAction.crud.createOne<CreateCardOne.Request, CreateCardOne.Response>(
  AttachmentType.CARD
);

/* CreateMediaOne */

export namespace CreateMediaOne {
  export interface Request extends DesignerAction {
    data: CreateMediaData;
  }

  export interface Response extends CreateResponse<MediaAttachment>, DesignerAction {}
}

export const CreateMediaOne = attachmentAction.crud.createOne<CreateMediaOne.Request, CreateMediaOne.Response>(
  AttachmentType.MEDIA
);

/* PatchOneCard */

export interface PatchOneCard extends PatchOneRequest<PatchCardData>, DesignerAction {}

export const PatchOneCard = attachmentAction.crud.patchOne<PatchOneCard>(AttachmentType.CARD);

/* PatchOneMedia */

export interface PatchOneMedia extends PatchOneRequest<PatchMediaData>, DesignerAction {}

export const PatchOneMedia = attachmentAction.crud.patchOne<PatchOneMedia>(AttachmentType.MEDIA);

/* PatchManyCard */

export interface PatchManyCard extends PatchManyRequest<PatchCardData>, DesignerAction {}

export const PatchManyCard = attachmentAction.crud.patchMany<PatchManyCard>(AttachmentType.CARD);

/* PatchManyMedia */

export interface PatchManyMedia extends PatchManyRequest<PatchMediaData>, DesignerAction {}

export const PatchManyMedia = attachmentAction.crud.patchMany<PatchManyMedia>(AttachmentType.MEDIA);

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = attachmentAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = attachmentAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<AnyAttachment>, DesignerAction {}

export const Replace = attachmentAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<AnyAttachment>, DesignerAction {}

export const AddOne = attachmentAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<AnyAttachment>, DesignerAction {}

export const AddMany = attachmentAction.crud.addMany<AddMany>();
