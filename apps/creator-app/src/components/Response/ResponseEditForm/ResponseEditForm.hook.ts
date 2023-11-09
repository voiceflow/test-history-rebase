import { Channel, Language } from '@voiceflow/dtos';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

export const useResponseVariants = ({ responseID }: { responseID: string }) => {
  const discriminator = useSelector(Designer.Response.ResponseDiscriminator.selectors.oneByLanguageChannelResponseID, {
    channel: Channel.DEFAULT,
    // TODO: use language from redux
    language: Language.ENGLISH_US,
    responseID,
  });

  const variants = useSelector(Designer.Response.ResponseVariant.selectors.allByIDs, {
    ids: discriminator?.variantOrder ?? [],
  });

  return {
    variants,
    discriminatorID: discriminator?.id ?? null,
  };
};
