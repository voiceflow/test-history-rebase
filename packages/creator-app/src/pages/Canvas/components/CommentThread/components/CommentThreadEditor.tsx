import React from 'react';

import ThreadEditor from '@/pages/Canvas/components/ThreadEditor';
import { ThreadEntityContext } from '@/pages/Canvas/contexts';

const CommentThreadEditor: React.FC = () => {
  const threadEntity = React.useContext(ThreadEntityContext)!;
  const { thread } = threadEntity.useState((e) => ({
    thread: e.resolve().thread,
  }));

  return <ThreadEditor thread={thread} />;
};

export default CommentThreadEditor;
