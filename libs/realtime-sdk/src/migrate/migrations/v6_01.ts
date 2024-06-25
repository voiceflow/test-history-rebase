/* eslint-disable no-param-reassign */
import { SYSTEM_VARIABLE_DESCRIPTION_MAP, SYSTEM_VARIABLE_TYPE_MAP, SystemVariable } from '@voiceflow/dtos';
import { isSystemVariableName } from '@voiceflow/utils-designer';

import type { Transform } from './types';

// updates system variables description, adds VF_MEMORY system variable
const migrateToV6_01: Transform = ({ cms }, { project, creatorID }) => {
  cms.variables.forEach((variable) => {
    if (variable.isSystem && isSystemVariableName(variable.name)) {
      variable.description = SYSTEM_VARIABLE_DESCRIPTION_MAP[variable.name];
    }
  });

  cms.variables.push({
    id: SystemVariable.VF_MEMORY,
    name: SystemVariable.VF_MEMORY,
    color: '#515A63',
    isArray: false,
    isSystem: true,
    folderID: null,
    datatype: SYSTEM_VARIABLE_TYPE_MAP[SystemVariable.VF_MEMORY],
    createdAt: new Date().toJSON(),
    updatedAt: new Date().toJSON(),
    createdByID: creatorID,
    assistantID: project.id,
    updatedByID: creatorID,
    description: SYSTEM_VARIABLE_DESCRIPTION_MAP[SystemVariable.VF_MEMORY],
    defaultValue: null,
    environmentID: project.versionID,
  });
};

export default migrateToV6_01;
