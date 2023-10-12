import { z } from 'zod';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Action, BaseActionData } from '../action.dto';

export const GoToFlowActionData = BaseActionData.extend({
  flowID: z.string().uuid().nullable(),
});

export type GoToFlowActionData = z.infer<typeof GoToFlowActionData>;

export const GoToFlowAction = Action(NodeType.ACTION__GO_TO_FLOW__V3, GoToFlowActionData, NodePortsWithNext);

export type GoToFlowAction = z.infer<typeof GoToFlowAction>;
