import React from 'react';

import { useTrackingEvents } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

import Content from './Content';
import EditableComment, { EditableCommentRef } from './EditableComment';

const NewComment: React.ForwardRefRenderFunction<EditableCommentRef> = (_, ref) => {
  const engine = React.useContext(EngineContext)!;
  const [trackEvents] = useTrackingEvents();

  const onPost = async (value: string, mentions: number[]) => {
    await engine.comment.addNewThread(value, mentions);

    trackEvents.trackNewThreadCreated();
  };

  return (
    <Content>
      <EditableComment ref={ref} onPost={onPost} isEditing placeholder="Comment or @mention" onCancel={() => engine.comment.resetCreating()} />
    </Content>
  );
};

export default React.forwardRef(NewComment);
