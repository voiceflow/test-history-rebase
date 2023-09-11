import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const allEntitiesAtom = atomWithSelector(Designer.Entity.selectors.all);
export const entitiesMapByIDAtom = atomWithSelector(Designer.Entity.selectors.map);
