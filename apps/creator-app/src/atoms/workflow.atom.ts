import { Designer } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const workflowMapByDiagramIDAtom = atomWithSelector(Designer.Workflow.selectors.mapByDiagramID);
