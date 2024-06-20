import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const intentMapAtom = atomWithSelector(Designer.Intent.selectors.map);
