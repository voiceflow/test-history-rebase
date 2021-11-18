import { Writeable } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { GENERAL_PLATFORMS } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Visuals',
  platforms: [...(GENERAL_PLATFORMS as Writeable<typeof GENERAL_PLATFORMS>), Constants.PlatformType.DIALOGFLOW_ES_CHAT],

  step: VisualStep,
  editor: VisualEditor,
};

export default VisualManager;
