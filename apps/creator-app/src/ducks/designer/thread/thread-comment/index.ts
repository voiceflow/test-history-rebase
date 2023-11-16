import { Actions } from '@voiceflow/sdk-logux-designer';

export * as selectors from './selectors';
export * as effect from './thread-comment.effect';
export { threadCommentReducer as reducer } from './thread-comment.reducer';
export * from './thread-comment.state';

export const action = Actions.ThreadComment;
