import React from 'react';

import ThreadEditor, { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor';
import { ThreadEntityContext } from '@/pages/Canvas/contexts';

interface CommentThreadEditorProps {
  replyRef?: React.RefObject<EditableCommentRef>;
  schedulePopperUpdate?: VoidFunction;
}

const CommentThreadEditor: React.FC<CommentThreadEditorProps> = ({ replyRef, schedulePopperUpdate }) => {
  const threadEntity = React.useContext(ThreadEntityContext)!;

  const { thread, isFocused } = threadEntity.useState((e) => ({
    thread: e.resolve().thread,
    isFocused: e.isFocused,
  }));

  return <ThreadEditor thread={thread} replyRef={replyRef} isFocused={isFocused} schedulePopperUpdate={schedulePopperUpdate} />;
};

export default CommentThreadEditor;
