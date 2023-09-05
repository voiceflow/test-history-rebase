import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './variable.effect';
export { variableReducer as reducer } from './variable.reducer';
export * as selectors from './variable.select';
export * from './variable.state';

export const action = Actions.Variable;
