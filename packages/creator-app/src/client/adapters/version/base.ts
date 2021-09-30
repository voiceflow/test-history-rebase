import { Version as BaseVersion } from '@voiceflow/base-types';
import { Adapters } from '@voiceflow/realtime-sdk';

import { Version } from '@/models';

type SharedFields = 'creatorID' | 'projectID' | 'rootDiagramID' | 'folders' | 'topics' | 'components';

const baseVersionAdapter = Adapters.createAdapter<Pick<BaseVersion.BaseVersion, '_id' | SharedFields>, Pick<Version<any>, 'id' | SharedFields>>(
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
    throw new Adapters.AdapterNotImplementedError();
  }
);
export default baseVersionAdapter;
