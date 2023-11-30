import { atom } from 'jotai';

import { utterancesCountByIntentIDAtom } from '@/atoms/utterance.atom';

import type { CMSIntentSortContext } from './CMSIntent.interface';

export const cmsIntentSortContextAtom = atom(
  (get): CMSIntentSortContext => ({
    utterancesCountByIntentID: get(utterancesCountByIntentIDAtom),
  })
);
