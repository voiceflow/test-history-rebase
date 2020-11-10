import { createSelector } from 'reselect';

import { creatorDiagramIDSelector } from '@/ducks/creator';
import { Diagram } from '@/models';
import { denormalize, getNormalizedByKey } from '@/utils/normalized';

import { createCRUDSelectors } from '../utils/crud';
import { STATE_KEY } from './constants';
import { StructuredFlow } from './types';

// selectors

export const {
  root: rootDiagramsSelector,
  all: allDiagramsSelector,
  byID: diagramByIDSelector,
  findByIDs: diagramsByIDsSelector,
  has: hasDiagramsSelector,
  key: allDiagramIDsSelector,
} = createCRUDSelectors<Diagram>(STATE_KEY);

export const activeDiagramSelector = createSelector([diagramByIDSelector, creatorDiagramIDSelector], (getDiagram, activeDiagramID) =>
  activeDiagramID ? getDiagram(activeDiagramID) : null
);

export const subDiagramsByIDSelector = createSelector([diagramByIDSelector], (getDiagram) => (diagramID: string) =>
  getDiagram(diagramID)?.subDiagrams || []
);

export const flowStructureSelector = createSelector([rootDiagramsSelector], (state) => (diagramID: string) => {
  const flowIDs = state.allKeys;
  const flows = denormalize(state)
    .map(({ id, name }) => ({ id, name }))
    .reduce<Record<string, StructuredFlow>>((acc, flow) => Object.assign(acc, { [flow.id]: flow }), {});

  flowIDs.forEach((id) => {
    flows[id].children = getNormalizedByKey(state, id)
      .subDiagrams.map((subDiagramID) => flows[subDiagramID])
      .filter(Boolean);
    flows[id].parents = flowIDs
      .filter((subDiagramID) => getNormalizedByKey(state, subDiagramID).subDiagrams.includes(id))
      .map((subDiagramID) => flows[subDiagramID])
      .filter(Boolean);
  });

  return flows[diagramID];
});

export const diagramVariablesSelector = createSelector([diagramByIDSelector], (getDiagram) => (diagramID: string) =>
  getDiagram(diagramID)?.variables || []
);
