import type { TextResponseVariantCreate } from '@voiceflow/dtos';

export interface IResponseCreateForm {
  onResponseCreate: (responseID: string) => void;
}

export type ResponseVariants = Array<TextResponseVariantCreate & { tempID?: string }>;
