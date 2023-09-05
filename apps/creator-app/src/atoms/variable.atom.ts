import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const variablesMapByIDAtom = atomWithSelector(Designer.Variable.selectors.map);
