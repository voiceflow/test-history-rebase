import { Version } from '@voiceflow/dtos';

import { Transform } from './types';

// migrates deprecated KB steps to new format
const migrateToV7_03: Transform = ({ version: _version }) => {
  const version = _version as unknown as Version;
  if (version.settings?.intentClassification) {
    delete version.settings;
  }
};

export default migrateToV7_03;
