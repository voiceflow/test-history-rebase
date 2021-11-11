import { Node } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const CaptureStepData = define<Node.Capture.StepData>({
  slot: () => '',
  variable: () => lorem.word(),
  slotInputs: () => [datatype.uuid()],
});

export const CaptureNodeData = define<Omit<NodeData.Capture, 'buttons' | 'reprompt'>>({
  slot: () => datatype.uuid(),
  examples: () => [datatype.uuid()],
  variable: () => lorem.word(),
});
