import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';

export const AccountLinkingStepData = define<Node.AccountLinking.StepData>({});

export const AccountLinkingNodeData = define<NodeData.AccountLinking>({});
