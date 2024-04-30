import type { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const AccountLinkingStepData = define<AlexaNode.AccountLinking.StepData>({});

export const AccountLinkingNodeData = define<NodeData.AccountLinking>({});
