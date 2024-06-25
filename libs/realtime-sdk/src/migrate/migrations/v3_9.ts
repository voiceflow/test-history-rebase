/* eslint-disable no-param-reassign */

import { Utils } from '@voiceflow/common';

import type { Transform } from './types';

/**
 * this migration adds domains and migrates topics to the domain
 */
const migrateToV3_9: Transform = ({ version }) => {
  const topics = version.topics ?? [];

  const topicIDs = topics.map(({ sourceID }) => sourceID);

  version.domains = [{ id: Utils.id.cuid(), name: 'Home', live: true, topicIDs, rootDiagramID: version.rootDiagramID }];
};

export default migrateToV3_9;
