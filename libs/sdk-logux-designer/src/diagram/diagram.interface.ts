import type { EndAction } from './action/end/end-action.interface';
import type { GoToBlockAction } from './action/go-to-block/go-to-block-action.interface';
import type { GoToFlowAction } from './action/go-to-flow/go-to-flow-action.interface';
import type { GoToStoryAction } from './action/go-to-story/go-to-story-action.interface';
import type { OpenURLAction } from './action/open-url/open-url-action.interface';
import type { SetVariableAction } from './action/set-variable/set-variable-action.interface';
import type { ActionsNode } from './node/actions/actions-node.interface';
import type { BlockNode } from './node/block/block-node.interface';
import type { StartNode } from './node/start/start-node.interface';
import type { ConditionStep } from './step/condition/condition-step.interface';
import type { FlowStep } from './step/flow/flow-step.interface';
import type { FunctionStep } from './step/function/function-step.interface';
import type { ListenStep } from './step/listen/listen-step.interface';
import type { RandomStep } from './step/random/random-step.interface';
import type { ResponseStep } from './step/response/response-step.interface';
import type { SetStep } from './step/set/set-step.interface';

export interface Diagram {
  _version: number;
  id: string;
  createdAt: number;
  updatedAt: number;
  assistantID: string;
  nodes: Record<string, Diagram.Node>;
}

export namespace Diagram {
  export type Node =
    /* root */
    | ActionsNode
    | BlockNode
    | StartNode

    /* steps */
    | ConditionStep
    | FlowStep
    | FunctionStep
    | ListenStep
    | RandomStep
    | ResponseStep
    | SetStep

    /* actions */
    | EndAction
    | GoToBlockAction
    | GoToFlowAction
    | GoToStoryAction
    | OpenURLAction
    | SetVariableAction;
}
