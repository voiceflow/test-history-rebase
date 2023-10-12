import type { Markup, ObjectResource } from '@/common';

import type { AttachmentType } from './attachment-type.enum';
import type { MediaDatatype } from './media-datatype.enum';

interface BaseAttachment extends ObjectResource {
  assistantID: string;
}

export interface CardAttachment extends BaseAttachment {
  type: AttachmentType.CARD;
  title: Markup;
  description: Markup;
  buttonOrder: string[];
  mediaID: string | null;
}

export interface MediaAttachment extends BaseAttachment {
  type: AttachmentType.MEDIA;
  name: string;
  datatype: MediaDatatype;
  isAsset: boolean;
  url: Markup;
}

export type AnyAttachment = CardAttachment | MediaAttachment;
