import { SYSTEM_VARIABLE_DESCRIPTION_MAP, SYSTEM_VARIABLE_TYPE_MAP, SystemVariable } from '@voiceflow/dtos';

import type { Transform } from './types';

// adds VF_CHUNKS system variable
const migrateToV7_01: Transform = ({ cms }, { project, creatorID }) => {
  cms.variables.push({
    id: SystemVariable.VF_CHUNKS,
    name: SystemVariable.VF_CHUNKS,
    color: '#515A63',
    isArray: true,
    isSystem: true,
    folderID: null,
    datatype: SYSTEM_VARIABLE_TYPE_MAP[SystemVariable.VF_CHUNKS],
    createdAt: new Date().toJSON(),
    updatedAt: new Date().toJSON(),
    createdByID: creatorID,
    assistantID: project.id,
    updatedByID: creatorID,
    description: SYSTEM_VARIABLE_DESCRIPTION_MAP[SystemVariable.VF_CHUNKS],
    defaultValue: null,
    environmentID: project.versionID,
  });
};

export default migrateToV7_01;
