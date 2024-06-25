/* eslint-disable no-param-reassign */
import { BaseModels } from '@voiceflow/base-types';

import type { Transform } from './types';

/**
 * adds missing components to versions component list so all components are visible in the menu
 */
const migrateToV3_4: Transform = ({ diagrams, version }) => {
  diagrams.forEach((dbDiagram) => {
    if (
      (dbDiagram.type && dbDiagram.type !== BaseModels.Diagram.DiagramType.COMPONENT) ||
      version.components?.some(({ sourceID }) => sourceID === dbDiagram.diagramID)
    )
      return;

    version.components ??= [];
    version.components?.push({ sourceID: dbDiagram.diagramID, type: BaseModels.Version.FolderItemType.DIAGRAM });
  });
};

export default migrateToV3_4;
