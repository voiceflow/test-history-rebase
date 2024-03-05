/* eslint-disable no-param-reassign */
import { variableToLegacyVariableAdapter } from '@realtime-sdk/adapters';
import { Utils } from '@voiceflow/common';

import { Transform } from './types';

// adds in diagram variables to the cms variables
const migrateToV7_01: Transform = ({ cms, diagrams }, { project, creatorID }) => {
  const diagramVariables: string[] = [];

  diagrams.forEach((diagram) => {
    diagramVariables.push(...diagram.variables);
  });

  // this should only be an upsert, existing cms variables should not be affected
  cms.variables = variableToLegacyVariableAdapter.mapToDB(Utils.array.unique(diagramVariables), {
    creatorID,
    assistantID: project.id,
    environmentID: project.versionID,
  });
};

export default migrateToV7_01;
