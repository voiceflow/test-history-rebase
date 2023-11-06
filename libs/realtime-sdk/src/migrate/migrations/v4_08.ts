/* eslint-disable no-param-reassign */

import { CMSMigrationData, Transform } from './types';

// create assistant for legacy project
const migrateToV4_08: Transform = ({ cms = {} as CMSMigrationData }, { project }) => {
  if (!cms.assistant.id) {
    cms.assistant = {
      id: project.id,
      name: project.name,
      workspaceID: project.workspaceID,
      activePersonaID: null,
      activeEnvironmentID: project.versionID,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
  }
};

export default migrateToV4_08;
