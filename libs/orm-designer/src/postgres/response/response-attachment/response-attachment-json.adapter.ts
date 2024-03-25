import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSCreatableJSONAdapter } from '@/postgres/common';

import type {
  BaseResponseAttachmentJSON,
  BaseResponseAttachmentObject,
  ResponseCardAttachmentJSON,
  ResponseCardAttachmentObject,
  ResponseMediaAttachmentJSON,
  ResponseMediaAttachmentObject,
} from './response-attachment.interface';

export const BaseResponseAttachmentJSONAdapter = createSmartMultiAdapter<
  BaseResponseAttachmentObject,
  BaseResponseAttachmentJSON
>(PostgresCMSCreatableJSONAdapter.fromDB, PostgresCMSCreatableJSONAdapter.toDB);

export const ResponseCardAttachmentJSONAdapter = createSmartMultiAdapter<
  ResponseCardAttachmentObject,
  ResponseCardAttachmentJSON
>(
  ({ type, ...data }) => ({
    ...BaseResponseAttachmentJSONAdapter.fromDB(data),

    ...(type !== undefined && { type }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseAttachmentJSONAdapter.toDB(data),

    ...(type !== undefined && { type }),
  })
);

export const ResponseMediaAttachmentJSONAdapter = createSmartMultiAdapter<
  ResponseMediaAttachmentObject,
  ResponseMediaAttachmentJSON
>(
  ({ type, ...data }) => ({
    ...BaseResponseAttachmentJSONAdapter.fromDB(data),

    ...(type !== undefined && { type }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseAttachmentJSONAdapter.toDB(data),

    ...(type !== undefined && { type }),
  })
);
