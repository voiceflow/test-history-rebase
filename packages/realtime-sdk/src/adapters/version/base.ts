import { Version } from '@realtime-sdk/models';
import { BaseVersion } from '@voiceflow/base-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

export type SharedFields = 'creatorID' | 'projectID' | 'rootDiagramID' | 'folders' | 'topics' | 'components';

const baseVersionAdapter = createAdapter<Pick<BaseVersion.Version, '_id' | SharedFields>, Pick<Version<any>, 'id' | SharedFields>>(
  ({ _id, folders = {}, topics = [], creatorID, projectID, components = [], rootDiagramID }) => ({
    id: _id,
    topics,
    folders,
    creatorID,
    projectID,
    components,
    rootDiagramID,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default baseVersionAdapter;
