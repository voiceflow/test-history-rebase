import type { ResponseVariantType } from '@voiceflow/sdk-logux-designer';

export interface IResponseEditFormSectionGenerateButton {
  type: ResponseVariantType;
  onClick: VoidFunction;
  loading: boolean;
}
