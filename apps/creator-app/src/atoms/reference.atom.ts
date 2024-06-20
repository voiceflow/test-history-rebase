import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const normalizedResourcesAtom = atomWithSelector(Designer.Reference.selectors.normalizedResources);

export const intentIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.intentIDResourceIDMap);

export const diagramIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.diagramIDResourceIDMap);

export const functionIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.functionIDResourceIDMap);

export const refererIDsByResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.refererIDsByResourceIDMap);

export const nonEmptyTriggersMapByDiagramIDAtom = atomWithSelector(
  Designer.Reference.selectors.nonEmptyTriggersMapByDiagramID
);
