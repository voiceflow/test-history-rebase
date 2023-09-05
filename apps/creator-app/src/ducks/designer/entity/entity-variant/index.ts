import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './entity-variant.effect';
export { entityVariantReducer as reducer } from './entity-variant.reducer';
export * as selectors from './entity-variant.select';
export * from './entity-variant.state';

export const action = Actions.EntityVariant;
