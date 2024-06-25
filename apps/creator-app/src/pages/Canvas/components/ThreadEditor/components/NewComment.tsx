import React from 'react';

import { useTrackingEvents } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

import Content from './Content';
import type { EditableCommentRef } from './EditableComment';
import EditableComment from './EditableComment';

const NewComment: React.ForwardRefRenderFunction<
  EditableCommentRef,
  { containerRef?: React.RefObject<HTMLDivElement> }
> = ({ containerRef }, ref) => {
  const engine = React.useContext(EngineContext)!;
  const [trackEvents] = useTrackingEvents();

  const onPost = async (value: string, mentions: number[]) => {
    await engine.comment.addNewThread(value, mentions);

    trackEvents.trackNewThreadCreated();
  };

  return (
    <Content ref={containerRef}>
      <EditableComment
        ref={ref}
        onPost={onPost}
        isEditing
        placeholder="Comment or @mention"
        onCancel={() => engine.comment.resetCreating()}
      />
    </Content>
  );
};

export default React.forwardRef(NewComment);
