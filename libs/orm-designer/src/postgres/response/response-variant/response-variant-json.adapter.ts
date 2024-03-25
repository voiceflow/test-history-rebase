import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type {
  BaseResponseVariantJSON,
  BaseResponseVariantObject,
  JSONResponseVariantJSON,
  JSONResponseVariantObject,
  TextResponseVariantJSON,
  TextResponseVariantObject,
} from './response-variant.interface';

export const BaseResponseVariantJSONAdapter = createSmartMultiAdapter<
  BaseResponseVariantObject,
  BaseResponseVariantJSON
>(PostgresCMSObjectJSONAdapter.fromDB, PostgresCMSObjectJSONAdapter.toDB);

export const JSONResponseVariantJSONAdapter = createSmartMultiAdapter<
  JSONResponseVariantObject,
  JSONResponseVariantJSON
>(
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.fromDB(data),

    ...(type !== undefined && { type }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.toDB(data),

    ...(type !== undefined && { type }),
  })
);

export const TextResponseVariantJSONAdapter = createSmartMultiAdapter<
  TextResponseVariantObject,
  TextResponseVariantJSON
>(
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.fromDB(data),

    ...(type !== undefined && { type }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.toDB(data),

    ...(type !== undefined && { type }),
  })
);
