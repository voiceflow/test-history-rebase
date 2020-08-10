import React from 'react';

import { useTrackingEvents } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

import EditableComment from './EditableComment';

const NewComment: React.FC = () => {
  const ref = React.useRef<{ reset: () => void } | null>(null);
  const engine = React.useContext(EngineContext)!;
  const [trackEvents] = useTrackingEvents();

  const onSave = React.useCallback((comment) => {
    engine.comment.addNewThread(comment.text, comment.mentions);
    trackEvents.trackNewThreadCreated();
  }, []);

  React.useEffect(() => {
    ref.current?.reset();
  }, [origin]);

  return <EditableComment isEditing onSave={onSave} ref={ref} />;
};

export default NewComment;
