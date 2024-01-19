import { atom } from 'jotai';

import { notEmptyUtterancesCountByIntentIDAtom } from '@/atoms/utterance.atom';

import type { CMSIntentSortContext } from './CMSIntent.interface';

export const cmsIntentSortContextAtom = atom(
  (get): CMSIntentSortContext => ({
    notEmptyUtterancesCountByIntentID: get(notEmptyUtterancesCountByIntentIDAtom),
  })
);
