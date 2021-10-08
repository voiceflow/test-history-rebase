import { Constants } from '@voiceflow/general-types';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import CustomPayloadEditor from './CustomPayloadEditor';
import CustomPayloadStep from './CustomPayloadStep';

const CustomPayloadManager: NodeManagerConfig<NodeData.CustomPayload> = {
  ...NODE_CONFIG,

  label: 'Custom Payload',
  platforms: [Constants.PlatformType.DIALOGFLOW_ES],

  step: CustomPayloadStep,
  editor: CustomPayloadEditor,
};

export default CustomPayloadManager;
