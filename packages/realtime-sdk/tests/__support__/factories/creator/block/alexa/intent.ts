import { Constants } from '@voiceflow/general-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';

// eslint-disable-next-line import/prefer-default-export
export const IntentNodeData = extend<ReturnType<typeof Base.IntentNodeData>, NodeData.Intent>(Base.IntentNodeData, {
  [Constants.PlatformType.ALEXA]: () => Base.IntentPlatformData(),
});
