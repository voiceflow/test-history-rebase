import type {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  ResponseDiscriminatorObject,
  ResponseMessageObject,
  ResponseObject,
  ResponseORM,
} from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common/types';

import type { ResponseMessageCreateWithSubResourcesData } from './response-message/response-message.interface';
import type { ResponseTextVariantCreateWithSubResourcesData } from './response-variant/response-variant.interface';

export interface ResponseCreateWithSubResourcesData extends CMSCreateForUserData<ResponseORM> {
  variants: Array<ResponseTextVariantCreateWithSubResourcesData<'discriminatorID'>>;
  messages?: Array<ResponseMessageCreateWithSubResourcesData<'discriminatorID'>>;
}

export const OMIT_DUPLICATE_RESPONSE = ['id', 'createdAt', 'updatedAt', 'createdByID', 'updatedByID'] as const;
export const OMIT_DUPLICATE_DISCRIMINATOR = ['id', 'createdAt', 'updatedAt', 'updatedByID'] as const;
export const OMIT_DUPLICATE_VARIANTS = ['id', 'createdAt', 'updatedAt', 'updatedByID'] as const;
export const OMIT_DUPLICATE_MESSAGES = ['id', 'createdAt', 'updatedAt', 'updatedByID'] as const;
export const OMIT_DUPLICATE_ATTACHMENT = ['id', 'createdAt'] as const;

export type DuplicateResponse = Omit<ResponseObject, (typeof OMIT_DUPLICATE_RESPONSE)[number]>;
export type DuplicateDiscriminator = Omit<ResponseDiscriminatorObject, (typeof OMIT_DUPLICATE_DISCRIMINATOR)[number]>;
export type DuplicateVariant = Omit<AnyResponseVariantObject, (typeof OMIT_DUPLICATE_VARIANTS)[number]>;
export type DuplicateAttachment = Omit<AnyResponseAttachmentObject, (typeof OMIT_DUPLICATE_ATTACHMENT)[number]>;
export type DuplicateMessage = Omit<ResponseMessageObject, (typeof OMIT_DUPLICATE_MESSAGES)[number]>;
