import { Node } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype } from 'faker';

import { NodeData } from '@/models';
import { getRandomEnumElement } from '@/tests/utils';

export const SpeakStepData = define<Node.Speak.StepData>({
  randomize: () => datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(Node.Utils.CanvasNodeVisibility),
});

export const SpeakNodeData = define<Omit<NodeData.Speak, 'dialogs'>>({
  randomize: () => datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(Node.Utils.CanvasNodeVisibility),
});
