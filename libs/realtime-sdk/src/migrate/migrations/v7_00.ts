import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import type { Transform } from './types';

// migrates legacy components to cms flows
const migrateToV7_00: Transform = ({ cms, diagrams }, { project, creatorID }) => {
  const createdAt = new Date().toISOString();

  diagrams.forEach((diagram) => {
    if (diagram.type !== BaseModels.Diagram.DiagramType.COMPONENT) return;

    cms.flows.push({
      id: Utils.id.objectID(),
      name: diagram.name,
      createdAt,
      folderID: null,
      updatedAt: createdAt,
      diagramID: diagram.diagramID,
      createdByID: creatorID,
      updatedByID: creatorID,
      description: null,
      assistantID: project.id,
      environmentID: project.versionID,
    });
  });
};

export default migrateToV7_00;
