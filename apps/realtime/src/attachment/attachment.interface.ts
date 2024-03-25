import type { AttachmentType } from '@voiceflow/dtos';
import type { CardAttachmentObject, CardAttachmentORM, MediaAttachmentObject, MediaAttachmentORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData, CMSPatchData } from '@/common/types';

export interface AttachmentCardCreateData extends CMSCreateForUserData<CardAttachmentORM> {
  type: typeof AttachmentType.CARD;
}

export interface AttachmentMediaCreateData extends CMSCreateForUserData<MediaAttachmentORM> {
  type: typeof AttachmentType.MEDIA;
}

export type AnyAttachmentCreateData = AttachmentCardCreateData | AttachmentMediaCreateData;

export interface AttachmentCardPatchData extends CMSPatchData<CardAttachmentORM> {
  type: typeof AttachmentType.CARD;
}

export interface AttachmentMediaPatchData extends CMSPatchData<MediaAttachmentORM> {
  type: typeof AttachmentType.MEDIA;
}

export type AttachmentPatchData = AttachmentCardPatchData | AttachmentMediaPatchData;

export interface AttachmentCardObjectWithType extends CardAttachmentObject {
  type: typeof AttachmentType.CARD;
}

export interface AttachmentMediaObjectWithType extends MediaAttachmentObject {
  type: typeof AttachmentType.MEDIA;
}

export type AnyAttachmentObjectWithType = AttachmentCardObjectWithType | AttachmentMediaObjectWithType;
