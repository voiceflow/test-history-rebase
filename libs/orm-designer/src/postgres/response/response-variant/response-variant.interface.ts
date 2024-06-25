import type { ToJSON, ToObject } from '@/types';

import type { BaseResponseVariantEntity, TextResponseVariantEntity } from './response-variant.entity';

export type BaseResponseVariantObject = ToObject<BaseResponseVariantEntity>;
export type BaseResponseVariantJSON = ToJSON<BaseResponseVariantObject>;

export type TextResponseVariantObject = ToObject<TextResponseVariantEntity>;
export type TextResponseVariantJSON = ToJSON<TextResponseVariantObject>;

export type AnyResponseVariantJSON = TextResponseVariantJSON;
export type AnyResponseVariantEntity = TextResponseVariantEntity;
export type AnyResponseVariantObject = TextResponseVariantObject;
