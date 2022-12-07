/* eslint-disable no-param-reassign */
import uniqBy from 'lodash/uniqBy';

import { Transform } from './types';

/**
 * this migration fixes versions with duplicate intents/entities that have the same ID
 */
const migrateToV3_93: Transform = ({ version }) => {
  version.platformData.intents = uniqBy(version.platformData.intents, 'id');
  version.platformData.slots = uniqBy(version.platformData.slots, 'key');
};

export default migrateToV3_93;
