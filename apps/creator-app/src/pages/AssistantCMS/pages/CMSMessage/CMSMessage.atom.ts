import type { Nullish } from '@voiceflow/common';
import { Channel, Language } from '@voiceflow/dtos';
import { atom } from 'jotai';

import { entitiesVariablesMapsAtom } from '@/atoms/other.atom';
import {
  getOneResponseDiscriminatorByLanguageChannelAtomResponseID,
  getOneResponseMessageByIDAtom,
} from '@/atoms/response.atom';

import type { CMSMessageSortContext } from './CMSMessage.interface';

export const cmsResponseGetVariantByResponseIDAtom = atom((get) => {
  const getOneResponseMessage = get(getOneResponseMessageByIDAtom);
  const getOneResponseDiscriminator = get(getOneResponseDiscriminatorByLanguageChannelAtomResponseID);

  return ({ responseID }: { responseID: Nullish<string> }) => {
    const discriminator = getOneResponseDiscriminator({
      channel: Channel.DEFAULT,
      language: Language.ENGLISH_US,
      responseID,
    });

    if (!discriminator) return null;

    return getOneResponseMessage({ id: discriminator.variantOrder[0] });
  };
});

export const cmsResponseSortContextAtom = atom(
  (get): CMSMessageSortContext => ({
    ...get(entitiesVariablesMapsAtom),
    getVariantByResponseID: get(cmsResponseGetVariantByResponseIDAtom),
  })
);
