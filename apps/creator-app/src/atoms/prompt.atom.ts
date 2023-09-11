import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const getOnePromptByIDAtom = atomWithSelector(Designer.Prompt.selectors.getOneByID);
