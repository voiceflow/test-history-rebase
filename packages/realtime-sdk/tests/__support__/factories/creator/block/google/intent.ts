import { Constants } from '@voiceflow/general-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';

export const IntentNodeData = extend<ReturnType<typeof Base.IntentNodeData>, NodeData.Intent>(Base.IntentNodeData, {
  [Constants.PlatformType.GOOGLE]: () => Base.IntentPlatformData(),
});
