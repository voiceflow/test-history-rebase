import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './trigger.effect';
export { triggerReducer as reducer } from './trigger.reducer';
export * as selectors from './trigger.select';
export * from './trigger.state';

export const action = Actions.Trigger;
