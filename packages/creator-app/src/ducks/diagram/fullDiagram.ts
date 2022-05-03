import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { creatorDiagramSelector } from '@/ducks/creator/diagram/selectors';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2/selectors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/versionV2';
import * as Viewport from '@/ducks/viewport';

/**
 * @deprecated
 */
export const fullActiveDiagramSelector = createSelector(
  [
    CreatorV2.activeDiagramIDSelector,
    Viewport.getViewportByIDSelector,
    creatorDiagramSelector,
    CreatorV2.allLinksSelector,
    ProjectV2.active.projectSelector,
    DiagramV2.getDiagramByIDSelector,
    Version.active.schemaVersionSelector,
  ],
  // eslint-disable-next-line max-params
  (diagramID, getViewport, { rootNodeIDs, nodes, ports, data, markupNodeIDs }, links, project, getDiagram, schemaVersion) => {
    if (!diagramID || !project) return null;

    // always use the `creatorDiagramID` as canonical, it is possible for DiagramV2.active to be desynced
    const diagram = getDiagram({ id: diagramID });
    const type = diagram?.type ?? undefined;
    if (!diagram) return null;

    const { variables } = diagram;
    const { platform, type: projectType } = project;
    const viewport = getViewport({ id: diagramID });

    const creator = Realtime.Adapters.creatorAdapter.toDB(
      {
        diagramID,
        viewport,
        rootNodeIDs,
        links,
        data,
        markupNodeIDs,
      } as Realtime.CreatorDiagram,
      { nodes, ports, platform, projectType, context: { schemaVersion } }
    );

    return { ...creator, variables, type };
  }
);
