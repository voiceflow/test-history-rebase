import { createSelector } from 'reselect';

import creatorAdapter from '@/client/adapters/creator';
import { BUILT_IN_VARIABLES } from '@/constants';
import { allLinksSelector, creatorDiagramIDSelector, creatorDiagramSelector } from '@/ducks/creator/diagram/selectors';
import { allActiveFeaturesSelector } from '@/ducks/feature';
import { activePlatformSelector } from '@/ducks/project';
import { slotNamesSelector } from '@/ducks/slot';
import { createCRUDSelectors } from '@/ducks/utils/crud';
import { activeGlobalVariablesSelector } from '@/ducks/version/selectors';
import * as Viewport from '@/ducks/viewport';
import { CreatorDiagram } from '@/models';
import { unique } from '@/utils/array';
import { denormalize, getNormalizedByKey } from '@/utils/normalized';

import { STATE_KEY } from './constants';
import { StructuredFlow } from './types';

// selectors
export const {
  root: rootDiagramsSelector,
  all: allDiagramsSelector,
  byID: diagramByIDSelector,
  findByIDs: diagramsByIDsSelector,
  has: hasDiagramsSelector,
  allIDs: allDiagramIDsSelector,
  map: diagramMapSelector,
} = createCRUDSelectors(STATE_KEY);

export const structureSelector = createSelector([rootDiagramsSelector], (state) => (diagramID: string) => {
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

export const localVariablesByDiagramIDSelector = createSelector([diagramByIDSelector], (getDiagram) => (diagramID: string) =>
  getDiagram(diagramID)?.variables || []
);

//  active diagram

export const activeDiagramSelector = createSelector([diagramByIDSelector, creatorDiagramIDSelector], (getDiagram, activeDiagramID) =>
  activeDiagramID ? getDiagram(activeDiagramID) : null
);

export const activeDiagramStructureSelector = createSelector([structureSelector, creatorDiagramIDSelector], (getFlowStructure, activeDiagramID) =>
  activeDiagramID ? getFlowStructure(activeDiagramID) : null
);

export const activeDiagramLocalVariablesSelector = createSelector(
  [creatorDiagramIDSelector, localVariablesByDiagramIDSelector],
  (diagramID, variablesByDiagramID) => (diagramID ? variablesByDiagramID(diagramID) : [])
);

export const activeDiagramAllVariablesSelector = createSelector(
  [activeGlobalVariablesSelector, activeDiagramLocalVariablesSelector, slotNamesSelector],
  (globalVariables, activeDiagramVariables, slotNames) => unique([...slotNames, ...BUILT_IN_VARIABLES, ...globalVariables, ...activeDiagramVariables])
);

export const fullActiveDiagramSelector = createSelector(
  [
    creatorDiagramIDSelector,
    Viewport.viewportByIDSelector,
    localVariablesByDiagramIDSelector,
    creatorDiagramSelector,
    allLinksSelector,
    activePlatformSelector,
    allActiveFeaturesSelector,
  ],
  // eslint-disable-next-line max-params
  (diagramID, getViewport, getLocalVariables, { rootNodeIDs, nodes, ports, data, markupNodeIDs }, links, platform, features) => {
    if (!diagramID) return null;

    const viewport = getViewport(diagramID);
    const variables = getLocalVariables(diagramID);

    const diagram = creatorAdapter.toDB(
      {
        diagramID,
        viewport,
        rootNodeIDs,
        links,
        data,
        markupNodeIDs,
      } as CreatorDiagram,
      { nodes, ports, platform, features }
    );

    return { ...diagram, variables };
  }
);
