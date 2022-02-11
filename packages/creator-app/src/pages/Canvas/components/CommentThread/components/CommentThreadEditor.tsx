import React from 'react';

import ThreadEditor from '@/pages/Canvas/components/ThreadEditor';
import { ThreadEntityContext } from '@/pages/Canvas/contexts';

const CommentThreadEditor: React.FC = () => {
  const threadEntity = React.useContext(ThreadEntityContext)!;
  const { thread, isFocused } = threadEntity.useState((e) => ({
    thread: e.resolve().thread,
    isFocused: e.isFocused,
  }));

  return <ThreadEditor isFocused={isFocused} thread={thread} />;
};

export default CommentThreadEditor;
