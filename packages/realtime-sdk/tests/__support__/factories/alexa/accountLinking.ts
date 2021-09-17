import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';

export const accountLinkingStepDataFactory = define<Node.AccountLinking.StepData>({});

export const accountLinkingNodeDataFactory = define<NodeData.AccountLinking>({});
