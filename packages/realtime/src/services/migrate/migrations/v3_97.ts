/* eslint-disable no-param-reassign */

import { BaseModels } from '@voiceflow/base-types';

import { Transform } from './types';

/**
 * removes root diagram id from the components list
 */
const migrateToV3_97: Transform = ({ version }) => {
  version.components =
    version.components?.filter(({ type, sourceID }) => type !== BaseModels.Version.FolderItemType.DIAGRAM || sourceID !== version.rootDiagramID) ??
    [];
};

export default migrateToV3_97;
