import * as Realtime from '@voiceflow/realtime-sdk';

import { NODE_CONFIG } from './constants';

export const setFactory = () => NODE_CONFIG.factory(undefined).data.sets[0];

export const setClone = (initVal: Realtime.NodeData.SetExpressionV2, targetVal: Realtime.NodeData.SetExpressionV2) => ({
  ...initVal,
  variable: targetVal.variable,
  expression: targetVal.expression,
});
