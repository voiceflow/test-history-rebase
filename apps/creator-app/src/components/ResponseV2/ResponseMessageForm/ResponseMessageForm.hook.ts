import { Channel, Language, ResponseType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { useAIGenerateResponseMessages } from '@/components/AI/hooks/ai-generate-response-messages.hook';
import { Designer } from '@/ducks';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { IResponseMessageForm } from './ResponseMessageForm.interface';

export const useResponseMessages = ({ responseID }: { responseID: string | null }) => {
  const discriminator = useSelector(Designer.Response.ResponseDiscriminator.selectors.oneByLanguageChannelResponseID, {
    channel: Channel.DEFAULT,
    // TODO: use language from redux
    language: Language.ENGLISH_US,
    responseID,
  });
  const messages = useSelector(Designer.Response.ResponseMessage.selectors.allByIDs, {
    ids: discriminator?.variantOrder ?? [],
  });

  return {
    messages,
    discriminatorID: discriminator?.id ?? null,
  };
};

export const useResponseMessageEditForm = ({
  responseID,
  onChangeResponse,
}: {
  responseID: string | null;
  onChangeResponse?: (data: Partial<Realtime.NodeData.Response>) => void;
}): IResponseMessageForm => {
  const deleteMessage = useDispatch(Designer.Response.ResponseMessage.effect.deleteOne);
  const createMessage = useDispatch(Designer.Response.ResponseMessage.effect.createOne);
  const patchMessage = useDispatch(Designer.Response.ResponseMessage.effect.patchOne);
  const createManyTextMessages = useDispatch(Designer.Response.ResponseMessage.effect.createMany);
  const patchResponse = useDispatch(Designer.Response.effect.patchOne);
  const getResponseByID = useSelector(Designer.Response.selectors.getOneByID);

  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const { messages, discriminatorID } = useResponseMessages({ responseID });

  const aiGenerateMessage = useAIGenerateResponseMessages({
    examples: messages,
    onGenerated: (newMessages) => discriminatorID && createManyTextMessages(discriminatorID, newMessages),
    successGeneratedMessage: 'Messages generated',
  });

  const [rootMessage, ...otherMessages] = messages;

  const checkAndUpdateResponseType = async () => {
    const response = getResponseByID({ id: responseID });

    if (!response) return;

    if (response.type !== ResponseType.MESSAGE) {
      onChangeResponse?.({ responseType: ResponseType.MESSAGE });
      await patchResponse(response.id, { type: ResponseType.MESSAGE });
    }
  };

  const onAddMessage = async () => {
    if (!discriminatorID) return undefined;

    await checkAndUpdateResponseType();

    const res = await createMessage(discriminatorID);

    return res;
  };

  const onUpdateMessage = async (messageID: string, data: Actions.ResponseMessage.PatchData) => {
    if (messageID === rootMessage.id) {
      await checkAndUpdateResponseType();
    }

    return patchMessage(messageID, data);
  };

  return {
    rootMessage,
    otherMessages,

    onAddMessage,
    onDeleteMessage: deleteMessage,
    onUpdateMessage,

    aiGenerate: {
      isEnabled: aiFeaturesEnabled,
      isFetching: aiGenerateMessage.fetching,
      onGenerate: aiGenerateMessage.onGenerate,
    },
  };
};
