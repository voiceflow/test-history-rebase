import type { ResponseVariantType } from '@voiceflow/dtos';

export interface IResponseEditFormSectionGenerateButton {
  type: ResponseVariantType;
  onClick: VoidFunction;
  disabled?: boolean;
  loading: boolean;
}
