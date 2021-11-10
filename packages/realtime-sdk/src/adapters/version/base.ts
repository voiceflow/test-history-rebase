import { Version as BaseVersion } from '@voiceflow/base-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

import { Version } from '../../models';

type SharedFields = 'creatorID' | 'projectID' | 'rootDiagramID' | 'folders' | 'topics' | 'components';

const baseVersionAdapter = createAdapter<Pick<BaseVersion.BaseVersion, '_id' | SharedFields>, Pick<Version<any>, 'id' | SharedFields>>(
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
