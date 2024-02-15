import { createSelector } from 'reselect';

import { diagramIDParamSelector } from '@/ducks/utils';

import { createByFolderIDSelectors } from '../../utils/selector.util';
import { all, oneByID } from './crud.select';

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const nameByID = createSelector(oneByID, (flow) => flow?.name ?? null);

export const byDiagramID = createSelector(all, diagramIDParamSelector, (flows, diagramID) => {
  return flows.find((flow) => flow.diagramID === diagramID);
});

export const mapByDiagramID = createSelector(all, (flows) => Object.fromEntries(flows.map((flow) => [flow.diagramID, flow])));
