import type { ResponseVariantType } from '@voiceflow/dtos';

import type { IResponseMessageInput } from '../ResponseMessageInput/ResponseMessageInput.interface';

export interface IResponseMessage extends Omit<IResponseMessageInput, 'children' | 'toolbar'> {
  removeButton?: React.ReactNode;
  onChangeVariantType: (type: ResponseVariantType) => void;
  canDrag?: boolean;
}
