import type { ResponseVariantType } from '@voiceflow/dtos';

export interface IResponseVariantTypeDropdown {
  value: ResponseVariantType;
  onValueChange: (value: ResponseVariantType) => void;
}
