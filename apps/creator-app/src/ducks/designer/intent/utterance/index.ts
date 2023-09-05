import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './utterance.effect';
export { utteranceReducer as reducer } from './utterance.reducer';
export * as selectors from './utterance.select';
export * from './utterance.state';

export const action = Actions.Utterance;
