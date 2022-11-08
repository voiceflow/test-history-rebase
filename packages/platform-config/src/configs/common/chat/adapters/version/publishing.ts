import * as Base from '@platform-config/configs/base';
import { BaseVersion } from '@voiceflow/base-types';
import { SimpleAdapter, SmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export const smart = Base.Adapters.Version.Publishing.smart as SmartSimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model>;

export const simple = Base.Adapters.Version.Publishing.simple as SimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model>;
