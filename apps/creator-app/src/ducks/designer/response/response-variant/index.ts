import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './response-variant.effect';
export { responseVariantReducer as reducer } from './response-variant.reducer';
export * as selectors from './response-variant.select';
export * from './response-variant.state';

export const action = Actions.ResponseVariant;
