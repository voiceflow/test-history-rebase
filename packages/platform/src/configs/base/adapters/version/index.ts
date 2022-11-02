import { BaseVersion } from '@voiceflow/base-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export * as Session from './session';

type FromDBArgs = [{ globalVariables: string[] }];

/**
 * filters out default global variables
 */
export const simple = createMultiAdapter<Pick<BaseVersion.Version, '_id' | Models.Version.ModelDBSharedFields>, Models.Version.Model, FromDBArgs>(
  (
    { _id, _version, folders = {}, creatorID, projectID, variables, components = [], rootDiagramID, defaultStepColors = {}, templateDiagramID },
    { globalVariables }
  ) => ({
    id: _id,
    status: null,
    session: null,
    folders,
    _version,
    settings: null,
    variables: variables.filter((variable) => !globalVariables.includes(variable)),
    creatorID,
    projectID,
    components,
    publishing: null,
    rootDiagramID,
    templateDiagramID,
    defaultStepColors,
  }),
  notImplementedAdapter.transformer
);
