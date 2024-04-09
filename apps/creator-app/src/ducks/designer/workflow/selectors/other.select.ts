import { Flow } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { diagramIDParamSelector } from '@/ducks/utils';

import { createByFolderIDSelectors } from '../../utils/selector.util';
import { all, oneByID } from './crud.select';

export const { allByFolderID, allByFolderIDs, countByFolderID } = createByFolderIDSelectors(all);

export const nameByID = createSelector(oneByID, (flow) => flow?.name ?? null);

export const mapByDiagramID = createSelector(
  all,
  (flows): Partial<Record<string, Flow>> => Object.fromEntries(flows.map((flow) => [flow.diagramID, flow]))
);
export const oneByDiagramID = createSelector(mapByDiagramID, diagramIDParamSelector, (map, diagramID) => (diagramID ? map[diagramID] : null));

export const allOrderedByName = createSelector([all], (entities) => entities.sort((a, b) => a.name.localeCompare(b.name)));
