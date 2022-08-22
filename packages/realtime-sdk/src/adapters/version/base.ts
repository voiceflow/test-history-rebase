import { Version } from '@realtime-sdk/models';
import { BaseVersion } from '@voiceflow/base-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

export type SharedFields =
  | '_version'
  | 'creatorID'
  | 'projectID'
  | 'rootDiagramID'
  | 'folders'
  | 'topics'
  | 'components'
  | 'templateDiagramID'
  | 'defaultStepColors';

const baseVersionAdapter = createAdapter<Pick<BaseVersion.Version, '_id' | SharedFields>, Pick<Version<any>, 'id' | SharedFields>>(
  ({
    _id,
    _version,
    folders = {},
    topics = [],
    creatorID,
    projectID,
    components = [],
    rootDiagramID,
    templateDiagramID,
    defaultStepColors = {},
  }) => ({
    id: _id,
    _version,
    folders,
    creatorID,
    projectID,
    components,
    rootDiagramID,
    templateDiagramID,
    defaultStepColors,

    // TODO: remove when domains are released
    topics,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default baseVersionAdapter;
