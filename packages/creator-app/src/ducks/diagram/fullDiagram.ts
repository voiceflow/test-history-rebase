import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { allLinksSelector, creatorDiagramIDSelector, creatorDiagramSelector } from '@/ducks/creator/diagram/selectors';
import * as DiagramV2 from '@/ducks/diagramV2/selectors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Viewport from '@/ducks/viewport';

/**
 * @deprecated
 */
// eslint-disable-next-line import/prefer-default-export
export const fullActiveDiagramSelector = createSelector(
  [
    creatorDiagramIDSelector,
    Viewport.viewportByIDSelector,
    creatorDiagramSelector,
    allLinksSelector,
    ProjectV2.active.projectSelector,
    DiagramV2.getDiagramByIDSelector,
  ],
  // eslint-disable-next-line max-params
  (diagramID, getViewport, { rootNodeIDs, nodes, ports, data, markupNodeIDs }, links, project, getDiagram) => {
    if (!diagramID || !project) return null;

    // always use the `creatorDiagramID` as canonical, it is possible for DiagramV2.active to be desynced
    const diagram = getDiagram(diagramID);
    const type = diagram?.type ?? undefined;
    if (!diagram) return null;

    const { variables } = diagram;
    const { platform } = project;
    const viewport = getViewport(diagramID);

    const creator = Realtime.Adapters.creatorAdapter.toDB(
      {
        diagramID,
        viewport,
        rootNodeIDs,
        links,
        data,
        markupNodeIDs,
      } as Realtime.CreatorDiagram,
      { nodes, ports, platform, context: {} }
    );

    return { ...creator, variables, type };
  }
);
