import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { AttachmentType, CardAttachmentEntity, MediaAttachmentEntity } from '@/postgres/attachment';
import { PostgresCMSCreatableEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';
import type {
  BaseResponseAttachmentEntity,
  ResponseCardAttachmentEntity,
  ResponseMediaAttachmentEntity,
} from './response-attachment.entity';

export const BaseResponseAttachmentEntityAdapter = createSmartMultiAdapter<
  EntityObject<BaseResponseAttachmentEntity>,
  ToJSONWithForeignKeys<BaseResponseAttachmentEntity>,
  [],
  [],
  CMSKeyRemap<[['variant', 'variantID']]>
>(
  ({ variant, assistant, ...data }) => ({
    ...PostgresCMSCreatableEntityAdapter.fromDB(data),

    ...(variant !== undefined && { variantID: variant.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ variantID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSCreatableEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(variantID !== undefined && {
        variant: ref(BaseResponseVariantEntity, { id: variantID, environmentID }),
      }),
    }),
  })
);

export const ResponseCardAttachmentEntityAdapter = createSmartMultiAdapter<
  EntityObject<ResponseCardAttachmentEntity>,
  ToJSONWithForeignKeys<ResponseCardAttachmentEntity>,
  [],
  [],
  CMSKeyRemap<[['card', 'cardID'], ['variant', 'variantID']]>
>(
  ({ card, type, ...data }) => ({
    ...BaseResponseAttachmentEntityAdapter.fromDB(data),

    ...(card !== undefined && { cardID: card.id }),

    ...(type !== undefined && { type: AttachmentType.CARD }),
  }),
  ({ type, cardID, ...data }) => ({
    ...BaseResponseAttachmentEntityAdapter.toDB(data),

    ...(type !== undefined && { type: AttachmentType.CARD }),

    ...(cardID !== undefined &&
      data.environmentID !== undefined && {
        card: ref(CardAttachmentEntity, { id: cardID, environmentID: data.environmentID }),
      }),
  })
);

export const ResponseMediaAttachmentEntityAdapter = createSmartMultiAdapter<
  EntityObject<ResponseMediaAttachmentEntity>,
  ToJSONWithForeignKeys<ResponseMediaAttachmentEntity>,
  [],
  [],
  CMSKeyRemap<[['media', 'mediaID'], ['variant', 'variantID']]>
>(
  ({ media, type, ...data }) => ({
    ...BaseResponseAttachmentEntityAdapter.fromDB(data),

    ...(media !== undefined && { mediaID: media.id }),

    ...(type !== undefined && { type: AttachmentType.MEDIA }),
  }),
  ({ type, mediaID, ...data }) => ({
    ...BaseResponseAttachmentEntityAdapter.toDB(data),

    ...(type !== undefined && { type: AttachmentType.MEDIA }),

    ...(mediaID !== undefined &&
      data.environmentID !== undefined && {
        media: ref(MediaAttachmentEntity, { id: mediaID, environmentID: data.environmentID }),
      }),
  })
);
