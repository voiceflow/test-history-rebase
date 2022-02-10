import { AlexaNode } from '@voiceflow/alexa-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import * as Voice from '../voice';

export const InteractionStepData = extend<ReturnType<typeof Voice.InteractionStepData>, AlexaNode.Interaction.StepData>(
  Voice.InteractionStepData,
  {}
);

export const InteractionNodeData = extend<ReturnType<typeof Voice.InteractionNodeData>, NodeData.Interaction>(Voice.InteractionNodeData, {
  buttons: () => null,
  choices: () => [Base.ChoiceDistinctPlatformsData({ [VoiceflowConstants.PlatformType.ALEXA]: Base.ChoicePlatformNodeData() })],
});
