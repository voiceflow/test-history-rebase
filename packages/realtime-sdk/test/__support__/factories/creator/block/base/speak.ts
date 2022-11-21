import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype } from 'faker';

export const SpeakStepData = define<BaseNode.Speak.StepData>({
  randomize: () => datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(BaseNode.Utils.CanvasNodeVisibility),
});

export const SpeakNodeData = define<Omit<NodeData.Speak, 'dialogs'>>({
  randomize: () => datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(BaseNode.Utils.CanvasNodeVisibility),
});
