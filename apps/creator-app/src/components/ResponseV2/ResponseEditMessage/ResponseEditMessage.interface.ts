import type { ResponseMessage } from '@voiceflow/dtos';

import { IResponseMessageInput } from '../ResponseMessageInput/ResponseMessageInput.interface';

export interface IResponseEditMessage
  extends Omit<IResponseMessageInput, 'value' | 'textResponseVariant' | 'toolbar' | 'autoFocus' | 'onValueChange'> {
  responseMessage: ResponseMessage;
  autoFocus?: boolean;
  removeButton?: React.ReactNode;
  autoFocusIfEmpty?: boolean;
}
