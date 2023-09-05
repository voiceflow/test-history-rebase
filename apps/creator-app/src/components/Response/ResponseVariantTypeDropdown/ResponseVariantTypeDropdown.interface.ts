import type { ResponseVariantType } from '@voiceflow/sdk-logux-designer';

export interface IResponseVariantTypeDropdown {
  value: ResponseVariantType;
  onValueChange: (value: ResponseVariantType) => void;
}
