import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const nonEmptyTriggersMapByDiagramIDAtom = atomWithSelector(
  Designer.Reference.selectors.nonEmptyTriggersMapByDiagramID
);
