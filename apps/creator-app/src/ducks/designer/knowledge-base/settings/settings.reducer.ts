import { Actions } from '@voiceflow/sdk-logux-designer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { SettingsState } from './settings.state';
import { INITIAL_STATE } from './settings.state';

export const settingsReducer = reducerWithInitialState<SettingsState>(INITIAL_STATE)
  .case(Actions.KnowledgeBaseSettings.Replace, (_, { data }) => data)
  .case(Actions.KnowledgeBaseSettings.Patch, (state, { data }) => state && { ...state, ...data });
