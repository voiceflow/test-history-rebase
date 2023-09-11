import { ResponseVariantType } from '@voiceflow/sdk-logux-designer';

export const RESPONSE_VARIANT_TYPE_LABEL_MAP: Record<ResponseVariantType, string> = {
  [ResponseVariantType.TEXT]: 'Text',
  [ResponseVariantType.JSON]: 'JSON',
  [ResponseVariantType.PROMPT]: 'Prompt',
};
