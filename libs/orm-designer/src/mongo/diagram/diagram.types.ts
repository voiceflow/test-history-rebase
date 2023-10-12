import type { EndAction } from './action/end/end.action';
import type { GoToBlockAction } from './action/go-to-block/go-to-block.action';
import type { GoToFlowAction } from './action/go-to-flow/go-to-flow.action';
import type { GoToStoryAction } from './action/go-to-story/go-to-story.action';
import type { OpenURLAction } from './action/open-url/open-url.action';
import type { SetVariableAction } from './action/set-variable/set-variable.action';
import type { ActionsNode } from './node/actions/actions.node';
import type { BlockNode } from './node/block/block.node';
import type { StartNode } from './node/start/start.node';
import type { ConditionStep } from './step/condition/condition.step';
import type { FlowStep } from './step/flow/flow.step';
import type { FunctionStep } from './step/function/function.step';
import type { ListenStep } from './step/listen/listen.step';
import type { RandomStep } from './step/random/random.step';
import type { ResponseStep } from './step/response/response.step';
import type { SetStep } from './step/set/set.step';

export type AnyNode =
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
