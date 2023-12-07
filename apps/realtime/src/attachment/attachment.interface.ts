import type { AttachmentType, CardAttachmentEntity, MediaAttachmentEntity, ToJSONWithForeignKeys } from '@voiceflow/orm-designer';

import type { CreateOneForUserData, PatchOneData } from '@/common/types';

import type { CardAttachmentService } from './card-attachment.service';
import type { MediaAttachmentService } from './media-attachment.service';

export interface AttachmentCardCreateData extends CreateOneForUserData<CardAttachmentService> {
  type: typeof AttachmentType.CARD;
}

export interface AttachmentMediaCreateData extends CreateOneForUserData<MediaAttachmentService> {
  type: typeof AttachmentType.MEDIA;
}

export type AttachmentCreateData = AttachmentCardCreateData | AttachmentMediaCreateData;

export interface AttachmentCardPatchData extends PatchOneData<CardAttachmentService> {
  type: typeof AttachmentType.CARD;
}

export interface AttachmentMediaPatchData extends PatchOneData<MediaAttachmentService> {
  type: typeof AttachmentType.MEDIA;
}

export type AttachmentPatchData = AttachmentCardPatchData | AttachmentMediaPatchData;

export type AttachmentAnyImportData =
  | (ToJSONWithForeignKeys<CardAttachmentEntity> & Pick<AttachmentCardCreateData, 'type'>)
  | (ToJSONWithForeignKeys<MediaAttachmentEntity> & Pick<AttachmentMediaCreateData, 'type'>);
