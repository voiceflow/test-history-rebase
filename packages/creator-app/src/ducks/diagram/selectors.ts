import { Adapters } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { allLinksSelector, creatorDiagramIDSelector, creatorDiagramSelector } from '@/ducks/creator/diagram/selectors';
import * as ProjectV2 from '@/ducks/projectV2';
import { createCRUDSelectors } from '@/ducks/utils/crud';
import * as Viewport from '@/ducks/viewport';
import { CreatorDiagram } from '@/models';

import { STATE_KEY } from './constants';

const diagramSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allDiagramsSelector = diagramSelectors.all;
/**
 * @deprecated
 */
export const allDiagramIDsSelector = diagramSelectors.allIDs;
/**
 * @deprecated
 */
export const diagramMapSelector = diagramSelectors.map;
/**
 * @deprecated
 */
export const diagramByIDSelector = diagramSelectors.byID;
/**
 * @deprecated
 */
export const diagramsByIDsSelector = diagramSelectors.findByIDs;

//  active diagram

const localVariablesByDiagramIDSelector = createSelector(
  [diagramByIDSelector],
  (getDiagram) => (diagramID: string) => getDiagram(diagramID)?.variables || []
);

//  active diagram

const activeDiagramSelector = createSelector([diagramByIDSelector, creatorDiagramIDSelector], (getDiagram, activeDiagramID) =>
  activeDiagramID ? getDiagram(activeDiagramID) : null
);

const activeDiagramTypeSelector = createSelector([activeDiagramSelector], (activeDiagram) => activeDiagram?.type ?? null);

/**
 * @deprecated
 */
export const fullActiveDiagramSelector = createSelector(
  [
    creatorDiagramIDSelector,
    Viewport.viewportByIDSelector,
    localVariablesByDiagramIDSelector,
    creatorDiagramSelector,
    allLinksSelector,
    ProjectV2.active.projectSelector,
    activeDiagramTypeSelector,
  ],
  // eslint-disable-next-line max-params
  (diagramID, getViewport, getLocalVariables, { rootNodeIDs, nodes, ports, data, markupNodeIDs }, links, project, diagramType) => {
    if (!diagramID || !project) return null;

    const { platform } = project;
    const viewport = getViewport(diagramID);
    const variables = getLocalVariables(diagramID);

    const diagram = Adapters.creatorAdapter.toDB(
      {
        diagramID,
        viewport,
        rootNodeIDs,
        links,
        data,
        markupNodeIDs,
      } as CreatorDiagram,
      { nodes, ports, platform, context: {} }
    );

    return { ...diagram, variables, type: diagramType ?? undefined };
  }
);
