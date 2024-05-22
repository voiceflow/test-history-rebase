import { ResponseVariantType } from '@voiceflow/dtos';

export const RESPONSE_VARIANT_TYPE_LABEL_MAP: Record<ResponseVariantType, string> = {
  [ResponseVariantType.TEXT]: 'Text',
  [ResponseVariantType.PROMPT]: 'Prompt',
};
