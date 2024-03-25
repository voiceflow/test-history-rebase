import type { ToJSON, ToObject } from '@/types';

import type {
  BaseResponseVariantEntity,
  JSONResponseVariantEntity,
  TextResponseVariantEntity,
} from './response-variant.entity';

export type BaseResponseVariantObject = ToObject<BaseResponseVariantEntity>;
export type BaseResponseVariantJSON = ToJSON<BaseResponseVariantObject>;

export type JSONResponseVariantObject = ToObject<JSONResponseVariantEntity>;
export type JSONResponseVariantJSON = ToJSON<JSONResponseVariantObject>;

export type TextResponseVariantObject = ToObject<TextResponseVariantEntity>;
export type TextResponseVariantJSON = ToJSON<TextResponseVariantObject>;

export type AnyResponseVariantJSON = TextResponseVariantJSON | JSONResponseVariantJSON;
export type AnyResponseVariantEntity = TextResponseVariantEntity | JSONResponseVariantEntity;
export type AnyResponseVariantObject = JSONResponseVariantObject | TextResponseVariantObject;
