import type { Nullish } from '@voiceflow/common';
import { Channel, Language } from '@voiceflow/dtos';
import { atom } from 'jotai';

import { entitiesVariablesMapsAtom } from '@/atoms/other.atom';
import { getOnePromptByIDAtom } from '@/atoms/prompt.atom';
import { getOneResponseDiscriminatorByLanguageChannelAtomResponseID, getOneResponseVariantByIDAtom } from '@/atoms/response.atom';

import type { CMSResponseSortContext } from './CMSResponse.interface';

export const cmsResponseGetVariantByResponseIDAtom = atom((get) => {
  const getOneResponseVariant = get(getOneResponseVariantByIDAtom);
  const getOneResponseDiscriminator = get(getOneResponseDiscriminatorByLanguageChannelAtomResponseID);

  return ({ responseID }: { responseID: Nullish<string> }) => {
    const discriminator = getOneResponseDiscriminator({
      channel: Channel.DEFAULT,
      language: Language.ENGLISH_US,
      responseID,
    });

    if (!discriminator) return null;

    return getOneResponseVariant({ id: discriminator.variantOrder[0] });
  };
});

export const cmsResponseGetVariantAttachmentOrderByResponseIDAtom = atom((get) => {
  const getVariantByResponseID = get(cmsResponseGetVariantByResponseIDAtom);

  return ({ responseID }: { responseID: Nullish<string> }) => getVariantByResponseID({ responseID })?.attachmentOrder ?? [];
});

export const cmsResponseSortContextAtom = atom(
  (get): CMSResponseSortContext => ({
    ...get(entitiesVariablesMapsAtom),
    getPromptByID: get(getOnePromptByIDAtom),
    getVariantByResponseID: get(cmsResponseGetVariantByResponseIDAtom),
  })
);
