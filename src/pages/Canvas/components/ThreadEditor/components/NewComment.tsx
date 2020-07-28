import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { Point } from '@/types';

import EditableComment from './EditableComment';

export type NewCommentProps = {
  origin: Point;
};

const NewComment: React.FC<NewCommentProps> = ({ origin }) => {
  const ref = React.useRef<{ reset: () => void } | null>(null);
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    ref.current?.reset();
  }, [origin]);

  return <EditableComment isEditing onSave={(comment) => engine.comment.addNewThread(origin, null, comment.text, comment.mentions)} ref={ref} />;
};

export default NewComment;
