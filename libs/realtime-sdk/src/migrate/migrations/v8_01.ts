/* eslint-disable no-param-reassign */
import { BlockType } from '@realtime-sdk/constants';
import { BaseModels } from '@voiceflow/base-types';

import { Transform } from './types';

export const LAST_UTTERANCE = '{{[last_utterance].last_utterance}}';

const isSetV2 = (dbNode: BaseModels.BaseDiagramNode) => dbNode.type === BlockType.SETV2;

/** migrates setV2 to setV3 -> move the label field from the node to individual sets
 * and assign the node label if it exists to the first set
 * */
const migrateToV8_01: Transform = ({ diagrams }) => {
  diagrams.forEach((diagram) => {
    Object.values(diagram.nodes).forEach((node) => {
      if (isSetV2(node) && node.data.label && node.data.sets.length > 0) {
        node.data.sets[0].label = node.data.label;
      }
    });
  });
};

export default migrateToV8_01;
