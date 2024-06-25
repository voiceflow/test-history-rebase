import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const getOneResponseMessageByIDAtom = atomWithSelector(Designer.Response.ResponseMessage.selectors.getOneByID);

export const getOneResponseDiscriminatorByLanguageChannelAtomResponseID = atomWithSelector(
  Designer.Response.ResponseDiscriminator.selectors.getOneByLanguageChannelResponseID
);
