import { Actions } from '@voiceflow/sdk-logux-designer';

export { referenceReducer as reducer } from './reference.reducer';
export * as selectors from './reference.select';
export * from './reference.state';

export const action = Actions.Reference;
