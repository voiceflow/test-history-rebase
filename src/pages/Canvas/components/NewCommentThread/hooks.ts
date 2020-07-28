import React from 'react';

import { useTeardown } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import { NewCommentAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

export type InternalNewCommentAPI = NewCommentAPI & {
  origin: Point | null;
};

export const useNewCommentAPI = () => {
  const engine = React.useContext(EngineContext)!;
  const [origin, setOrigin] = React.useState<Point | null>(null);

  return React.useMemo<InternalNewCommentAPI>(
    () => ({
      origin,
      show: (coords) => setOrigin(engine.canvas!.fromCoords(coords)),
      hide: () => setOrigin(null),
    }),
    [origin]
  );
};

export const useNewCommentSubscription = (api: NewCommentAPI) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => engine.comment.registerNewComment(api), [api]);

  useTeardown(() => {
    engine.comment.registerNewComment(null);
    api.hide();
  });
};
