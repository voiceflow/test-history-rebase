import React from 'react';

import { useTrackingEvents } from '@/hooks';
import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewCommentID } from '@/pages/Canvas/engine/commentEngine';

import EditableComment from './EditableComment';

const NewComment: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const [trackEvents] = useTrackingEvents();

  const onSave = React.useCallback((comment) => {
    engine.comment.addNewThread(comment.text, comment.mentions);
    engine.comment.resetDraftComment(NewCommentID);

    trackEvents.trackNewThreadCreated();
  }, []);

  const saveDraftValue = (values: Pick<Comment, 'text' | 'mentions'>) => engine.comment.setDraftComment(NewCommentID, values);

  return <EditableComment isEditing onSave={onSave} initialValues={engine.comment.draftComment?.[NewCommentID]} onBlur={saveDraftValue} />;
};

export default NewComment;
