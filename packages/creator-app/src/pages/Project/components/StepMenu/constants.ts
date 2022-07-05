import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { getManager } from '@/pages/Canvas/managers/constants';

import {
  ALEXA_STEP_SECTIONS,
  CHATBOT_STEP_SECTIONS,
  DIALOGFLOW_ES_CHAT_STEP_SECTIONS,
  DIALOGFLOW_ES_VOICE_STEP_SECTIONS,
  GENERAL_STEP_SECTIONS,
  GOOGLE_STEP_SECTIONS,
} from '../DesignMenu/components/Steps/constants';

export interface MenuStepItem {
  type: Realtime.BlockType;
  getIcon: (manager?: ReturnType<typeof getManager>) => any;
  getLabel: (manager?: ReturnType<typeof getManager>) => any;
  getStepMenuIcon: (manager?: ReturnType<typeof getManager>) => any;
  getStepTooltipText: (manager?: ReturnType<typeof getManager>) => string | undefined;
  getStepTooltipLink: (manager?: ReturnType<typeof getManager>) => string | undefined;
  factoryData?: Realtime.NodeData<any>;
  tooltipText?: string;
  tooltipLink?: string;
}

export interface StepItem {
  type: Realtime.BlockType;
  icon: React.FC;
  label: string;
  factoryData?: Realtime.NodeData<any>;
  tooltipText?: string;
  tooltipLink?: string;
}

export interface TopStepItem {
  steps?: MenuStepItem[];
  icon: React.FC;
  label: string;
}

export const getStepSections = Realtime.Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_STEP_SECTIONS,
    [VoiceflowConstants.PlatformType.GOOGLE]: GOOGLE_STEP_SECTIONS,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: CHATBOT_STEP_SECTIONS,
    [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.CHAT}`]: DIALOGFLOW_ES_CHAT_STEP_SECTIONS,
    [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.VOICE}`]: DIALOGFLOW_ES_VOICE_STEP_SECTIONS,
    [VoiceflowConstants.ProjectType.CHAT]: CHATBOT_STEP_SECTIONS,
    [VoiceflowConstants.ProjectType.VOICE]: GENERAL_STEP_SECTIONS,
  },
  GENERAL_STEP_SECTIONS
);
