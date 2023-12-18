import { Actions } from '@voiceflow/sdk-logux-designer';
import { normalize } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { AssistantAwarenessState } from './assistant-awareness.state';
import { INITIAL_STATE } from './assistant-awareness.state';

export const assistantAwarenessReducer = reducerWithInitialState<AssistantAwarenessState>(INITIAL_STATE).case(
  Actions.AssistantAwareness.ReplaceViewers,
  (state, { viewers, context }) => ({
    ...state,
    viewers: { ...state.viewers, [context.assistantID]: normalize(viewers, (viewer) => String(viewer.creatorID)) },
  })
);
