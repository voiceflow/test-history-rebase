import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const AccountLinkingStepData = define<AlexaNode.AccountLinking.StepData>({});

export const AccountLinkingNodeData = define<NodeData.AccountLinking>({});
