/* eslint-disable no-param-reassign */
import { BaseModels, BaseNode, BaseUtils } from '@voiceflow/base-types';

import { Transform } from './types';

export const LAST_UTTERANCE = '{{[last_utterance].last_utterance}}';

const isDeprecatedAISet = (dbNode: BaseModels.BaseDiagramNode): dbNode is BaseNode.AISet.Step =>
  dbNode.type === BaseNode.NodeType.AI_SET &&
  dbNode.data.overrideParams === undefined &&
  dbNode.data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE;

const isDeprecatedAIResponse = (dbNode: BaseModels.BaseDiagramNode): dbNode is BaseNode.AIResponse.Step =>
  dbNode.type === BaseNode.NodeType.AI_RESPONSE &&
  dbNode.data.overrideParams === undefined &&
  dbNode.data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE;

// migrates deprecated KB steps to new format
const migrateToV7_02: Transform = ({ diagrams }) => {
  diagrams.forEach((diagram) => {
    Object.values(diagram.nodes).forEach((node) => {
      if (isDeprecatedAISet(node)) {
        node.data.sets = node.data.sets.map((set) => ({ ...set, instruction: set.prompt, prompt: LAST_UTTERANCE }));
        node.data.overrideParams = false;
      }

      if (isDeprecatedAIResponse(node)) {
        node.data.notFoundPath = false;
        node.data.overrideParams = false;
        node.data.instruction = node.data.prompt;
        node.data.prompt = LAST_UTTERANCE;
      }
    });
  });
};

export default migrateToV7_02;
