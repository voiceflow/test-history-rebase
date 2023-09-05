import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './response-attachment.effect';
export { responseAttachmentReducer as reducer } from './response-attachment.reducer';
export * as selectors from './response-attachment.select';
export * from './response-attachment.state';

export const action = Actions.ResponseAttachment;
