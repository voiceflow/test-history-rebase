import { z } from 'zod';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Action, BaseActionData } from '../action.dto';

export const GoToStoryActionData = BaseActionData.extend({
  storyID: z.string().uuid().nullable(),
});

export type GoToStoryActionData = z.infer<typeof GoToStoryActionData>;

export const GoToStoryAction = Action(NodeType.ACTION__GO_TO_STORY__V3, GoToStoryActionData, NodePortsWithNext);

export type GoToStoryAction = z.infer<typeof GoToStoryAction>;
