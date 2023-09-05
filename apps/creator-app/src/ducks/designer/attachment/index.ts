import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './attachment.effect';
export { attachmentReducer as reducer } from './attachment.reducer';
export * as selectors from './attachment.select';
export * from './attachment.state';
export * as CardButton from './card-button';

export const action = Actions.Attachment;
