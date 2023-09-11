import { atom } from 'jotai';

import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const allUtterancesAtom = atomWithSelector(Designer.Intent.Utterance.selectors.all);

export const utterancesCountByIntentIDAtom = atom((get) => {
  const utterancesCountByIntentID: Partial<Record<string, number>> = {};

  const allUtterances = get(allUtterancesAtom);

  allUtterances.forEach(({ intentID }) => {
    utterancesCountByIntentID[intentID] ??= 0;
    utterancesCountByIntentID[intentID]! += 1;
  });

  return utterancesCountByIntentID;
});
