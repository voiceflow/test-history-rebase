import { z } from 'zod';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { ManualAssignment, PromptAssignment } from '../../step/set/assignment/assignment.dto';
import { Action, BaseActionData } from '../action.dto';

export const SetVariableActionData = BaseActionData.extend({
  assignment: z.union([ManualAssignment.omit({ id: true }), PromptAssignment.omit({ id: true })]),
});

export type SetVariableActionData = z.infer<typeof SetVariableActionData>;

export const SetVariableAction = Action(NodeType.ACTION__SET_VARIABLE__V3, SetVariableActionData, NodePortsWithNext);

export type SetVariableAction = z.infer<typeof SetVariableAction>;
