import type { BaseModels } from '@voiceflow/base-types';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { NestedMongoModel } from '../_mongo';
import { Bson } from '../utils';
import type { DBDomainModel } from './constants';
import { DOMAIN_DATE_KEYS } from './constants';
import type VersionModel from './index';

class DomainModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'domains' as const;

  adapter = createSmartMultiAdapter<DBDomainModel, BaseModels.Version.Domain>(
    Bson.dateToString(DOMAIN_DATE_KEYS),
    Bson.stringToDate(DOMAIN_DATE_KEYS)
  );
}

export default DomainModel;
