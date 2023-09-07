import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { Bson } from '../utils';

export const DOMAIN_DATE_KEYS = ['updatedAt'] as const;

export const VERSION_DOUBLE_KEYS = ['_version'] as const;
export const VERSION_DOMAINS_KEYS = ['domains'] as const;
export const VERSION_READ_ONLY_KEYS = ['_id', 'creatorID', 'projectID'] as const;
export const VERSION_OBJECT_ID_KEYS = ['_id', 'projectID', 'rootDiagramID', 'templateDiagramID'] as const;

export type DBDomainModel = Bson.StringToDate<BaseModels.Version.Domain, Realtime.ArrayItem<typeof DOMAIN_DATE_KEYS>>;

export type DBVersionModel = Omit<
  Bson.NumberToDouble<
    Bson.StringToObjectID<BaseVersion.Version, Realtime.ArrayItem<typeof VERSION_OBJECT_ID_KEYS>>,
    Realtime.ArrayItem<typeof VERSION_DOUBLE_KEYS>
  >,
  'domains'
> & {
  domains?: DBDomainModel[];
};
