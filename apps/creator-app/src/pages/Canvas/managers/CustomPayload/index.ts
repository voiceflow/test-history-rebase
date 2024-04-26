import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import CustomPayloadEditor from './CustomPayloadEditor';
import CustomPayloadStep from './CustomPayloadStep';

const CustomPayloadManager: NodeManagerConfig<
  Realtime.NodeData.CustomPayload,
  Realtime.NodeData.CustomPayloadBuiltInPorts
> = {
  ...NODE_CONFIG,

  label: 'Custom',
  platforms: [Platform.Constants.PlatformType.DIALOGFLOW_ES],

  step: CustomPayloadStep,
  editor: CustomPayloadEditor,
};

export default CustomPayloadManager;
