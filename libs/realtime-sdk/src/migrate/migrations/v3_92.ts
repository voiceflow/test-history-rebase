/* eslint-disable no-param-reassign */
import { BaseModels } from '@voiceflow/base-types';

import type { Transform } from './types';

/**
 * this migration fixes projects affected by an old bug where components didn't properly delete
 * they would delete from the version's topics/components but not the actual doc.
 */
const migrateToV3_92: Transform = ({ diagrams, version }) => {
  diagrams.forEach((dbDiagram) => {
    if (
      (dbDiagram.type && dbDiagram.type !== BaseModels.Diagram.DiagramType.COMPONENT) ||
      version.components?.some(({ sourceID }) => sourceID === dbDiagram._id)
    )
      return;

    version.components ??= [];
    version.components?.push({ sourceID: dbDiagram._id, type: BaseModels.Version.FolderItemType.DIAGRAM });
    dbDiagram.name = `[restored] ${dbDiagram.name}`;
  });
};

export default migrateToV3_92;
