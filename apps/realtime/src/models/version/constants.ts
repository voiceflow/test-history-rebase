import { BaseVersion } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { Bson } from '../utils';

export const VERSION_DOUBLE_KEYS = ['_version'] as const;
export const VERSION_READ_ONLY_KEYS = ['_id', 'creatorID', 'projectID'] as const;
export const VERSION_OBJECT_ID_KEYS = ['_id', 'projectID', 'rootDiagramID', 'templateDiagramID'] as const;

export type DBVersionModel = Bson.NumberToDouble<
  Bson.StringToObjectID<BaseVersion.Version, Realtime.ArrayItem<typeof VERSION_OBJECT_ID_KEYS>>,
  Realtime.ArrayItem<typeof VERSION_DOUBLE_KEYS>
>;
