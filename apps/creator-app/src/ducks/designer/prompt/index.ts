import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './prompt.effect';
export { promptReducer as reducer } from './prompt.reducer';
export * as selectors from './prompt.select';
export * from './prompt.state';

export const action = Actions.Prompt;
