import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './response-discriminator.effect';
export { responseDiscriminatorReducer as reducer } from './response-discriminator.reducer';
export * as selectors from './response-discriminator.select';
export * from './response-discriminator.state';

export const action = Actions.ResponseDiscriminator;
