import type { Markup, ObjectResource } from '@/common';

import type { AttachmentType } from './attachment-type.enum';
import type { MediaDatatype } from './media-datatype.enum';

interface BaseAttachment extends ObjectResource {
  assistantID: string;
}

export interface CardAttachment extends BaseAttachment {
  type: AttachmentType.CARD;
  title: Markup;
  mediaID: string | null;
  description: Markup;
  buttonOrder: string[];
  environmentID: string;
}

export interface MediaAttachment extends BaseAttachment {
  url: Markup;
  type: AttachmentType.MEDIA;
  name: string;
  isAsset: boolean;
  datatype: MediaDatatype;
  environmentID: string;
}

export type AnyAttachment = CardAttachment | MediaAttachment;
