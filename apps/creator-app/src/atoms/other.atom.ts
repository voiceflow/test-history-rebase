import { atom } from 'jotai';

import { entitiesMapByIDAtom } from './entity.atom';
import { variablesMapByIDAtom } from './variable.atom';

export const entitiesVariablesMapsAtom = atom((get) => ({
  entitiesMapByID: get(entitiesMapByIDAtom),
  variablesMapByID: get(variablesMapByIDAtom),
}));
