/* eslint-disable no-param-reassign */
import type { BaseModels } from '@voiceflow/base-types';

import type { Transform } from './types';

const builtInPrefixes = ['VF.', 'AMAZON.', 'actions.intent.'];

const isBuiltInIntent = (intent: BaseModels.Intent): boolean =>
  builtInPrefixes.some((prefix) => intent.key.startsWith(prefix));
/**
 * this migration converts the builtin intents that have a mismatch between the intent name and intent key
 * and updates them with the proper name (the same as the key)
 */
const migrateToV4_01: Transform = ({ version }) => {
  version.platformData.intents = version.platformData.intents.map((intent) => {
    if (isBuiltInIntent(intent) && intent.key !== intent.name) {
      return { ...intent, name: intent.key };
    }
    return intent;
  });
};

export default migrateToV4_01;
