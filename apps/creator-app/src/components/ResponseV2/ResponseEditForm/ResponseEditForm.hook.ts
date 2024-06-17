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
  const allMessages = useSelector(Designer.Response.ResponseMessage.selectors.all);

  // eslint-disable-next-line no-console
  console.log({ allMessages });

  const messages = useSelector(Designer.Response.ResponseMessage.selectors.allByIDs, {
    ids: discriminator?.variantOrder ?? [],
  });

  return {
    messages,
    discriminatorID: discriminator?.id ?? null,
  };
};
