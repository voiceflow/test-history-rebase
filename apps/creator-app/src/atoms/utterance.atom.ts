import { atom } from 'jotai';

import { Designer } from '@/ducks';
import { isUtteranceTextEmpty } from '@/utils/utterance.util';

import { atomWithSelector } from './store.atom';

export const allUtterancesAtom = atomWithSelector(Designer.Intent.Utterance.selectors.all);

export const notEmptyUtterancesCountByIntentIDAtom = atom((get) => {
  const notEmptyUtterancesCountByIntentID: Partial<Record<string, number>> = {};

  const allUtterances = get(allUtterancesAtom);

  allUtterances.forEach(({ text, intentID }) => {
    notEmptyUtterancesCountByIntentID[intentID] ??= 0;

    if (!isUtteranceTextEmpty(text)) {
      notEmptyUtterancesCountByIntentID[intentID]! += 1;
    }
  });

  return notEmptyUtterancesCountByIntentID;
});
