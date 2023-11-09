import type { ResponseVariantType } from '@voiceflow/dtos';

import type { IResponseTextInput } from '../ResponseTextInput/ResponseTextInput.interface';

export interface IResponseTextVariantLayout extends Omit<IResponseTextInput, 'children' | 'toolbar'> {
  variantType: ResponseVariantType;
  removeButton?: React.ReactNode;
  settingsButton: React.ReactNode;
  attachmentsList: React.ReactNode;
  attachmentButton: React.ReactNode;
  onChangeVariantType: (type: ResponseVariantType) => void;
}
