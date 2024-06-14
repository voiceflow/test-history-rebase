import { Channel, Language } from '@voiceflow/dtos';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

export const useResponseMessages = ({ responseID }: { responseID: string }) => {
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
