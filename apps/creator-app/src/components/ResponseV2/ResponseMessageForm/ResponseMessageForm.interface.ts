import type { ResponseMessage } from '@voiceflow/dtos';
import type { Actions } from '@voiceflow/sdk-logux-designer';

export interface IResponseMessageForm {
  rootMessage: ResponseMessage;
  otherMessages: ResponseMessage[];

  onAddMessage: () => Promise<undefined | ResponseMessage>;
  onDeleteMessage: (messageID: string) => void;
  onUpdateMessage: (id: string, patch: Actions.ResponseMessage.PatchData) => void;

  aiGenerate: {
    isEnabled: boolean;
    onGenerate: (options: { quantity: number }) => void;
    isFetching: boolean;
  };
}
