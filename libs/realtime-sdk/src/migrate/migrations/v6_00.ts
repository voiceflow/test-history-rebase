/* eslint-disable no-param-reassign */

import { variableToLegacyVariableAdapter } from '@realtime-sdk/adapters';
import { Utils } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';

import { Transform } from './types';

// migrates legacy variables to cms variables
const migrateToV6_00: Transform = ({ cms, version }, { project, creatorID }) => {
  const legacyVariables = Utils.array.unique([
    ...version.variables,
    SystemVariable.SESSIONS,
    SystemVariable.USER_ID,
    SystemVariable.TIMESTAMP,
    SystemVariable.PLATFORM,
    SystemVariable.LOCALE,
    SystemVariable.INTENT_CONFIDENCE,
    SystemVariable.LAST_RESPONSE,
    SystemVariable.LAST_EVENT,
    SystemVariable.LAST_UTTERANCE,
  ]);

  cms.variables = variableToLegacyVariableAdapter.mapToDB(legacyVariables, {
    creatorID,
    assistantID: project.id,
    environmentID: project.versionID,
  });
};

export default migrateToV6_00;
