import type { AttachmentType } from '@voiceflow/orm-designer';

import type { CreateOneData, PatchOneData } from '@/common/types';

import type { CardAttachmentService } from './card-attachment.service';
import type { MediaAttachmentService } from './media-attachment.service';

export interface AttachmentCardCreateData extends CreateOneData<CardAttachmentService> {
  type: AttachmentType.CARD;
}

export interface AttachmentMediaCreateData extends CreateOneData<MediaAttachmentService> {
  type: AttachmentType.MEDIA;
}

export type AttachmentCreateData = AttachmentCardCreateData | AttachmentMediaCreateData;

export interface AttachmentCardPatchData extends PatchOneData<CardAttachmentService> {
  type: AttachmentType.CARD;
}

export interface AttachmentMediaPatchData extends PatchOneData<MediaAttachmentService> {
  type: AttachmentType.MEDIA;
}

export type AttachmentPatchData = AttachmentCardPatchData | AttachmentMediaPatchData;
