import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const resourceMapAtom = atomWithSelector(Designer.Reference.selectors.resourceMap);

export const referenceMapAtom = atomWithSelector(Designer.Reference.selectors.referenceMap);

export const intentIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.intentIDResourceIDMap);

export const messageIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.messageIDResourceIDMap);

export const diagramIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.diagramIDResourceIDMap);

export const functionIDResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.functionIDResourceIDMap);

export const refererIDsByResourceIDMapAtom = atomWithSelector(Designer.Reference.selectors.refererIDsByResourceIDMap);

export const nonEmptyTriggersMapByDiagramIDAtom = atomWithSelector(
  Designer.Reference.selectors.nonEmptyTriggersMapByDiagramID
);
