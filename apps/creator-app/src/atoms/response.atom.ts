import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const getOneResponseVariantByIDAtom = atomWithSelector(Designer.Response.ResponseVariant.selectors.getOneByID);

export const getOneResponseDiscriminatorByLanguageChannelAtomResponseID = atomWithSelector(
  Designer.Response.ResponseDiscriminator.selectors.getOneByLanguageChannelResponseID
);
