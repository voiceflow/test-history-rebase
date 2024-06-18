import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const flowMapByDiagramIDAtom = atomWithSelector(Designer.Flow.selectors.mapByDiagramID);
