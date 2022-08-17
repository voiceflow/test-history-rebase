import { DiagramType } from '@voiceflow/base-types/build/cjs/models/diagram';
import { FolderItemType } from '@voiceflow/base-types/build/cjs/models/version';

import { Transform } from './types';

/**
 * adds missing components to versions component list so all components are visible in the menu
 */
const migrateToV3_4: Transform = ({ diagrams, version }) => {
  diagrams.forEach((dbDiagram) => {
    if ((dbDiagram.type && dbDiagram.type !== DiagramType.COMPONENT) || version.components?.some(({ sourceID }) => sourceID === dbDiagram._id))
      return;

    version.components?.push({ sourceID: dbDiagram._id, type: FolderItemType.DIAGRAM });
  });
};

export default migrateToV3_4;
