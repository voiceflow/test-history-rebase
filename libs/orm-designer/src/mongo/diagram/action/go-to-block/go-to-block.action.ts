import { z } from 'zod';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Action, BaseActionData } from '../action.dto';

export const GoToBlockActionData = BaseActionData.extend({
  block: z
    .object({
      diagramID: z.string(),
      nodeID: z.string(),
    })
    .nullable(),
});

export type GoToBlockActionData = z.infer<typeof GoToBlockActionData>;

export const GoToBlockAction = Action(NodeType.ACTION__GO_TO_BLOCK__V3, GoToBlockActionData, NodePortsWithNext);

export type GoToBlockAction = z.infer<typeof GoToBlockAction>;
