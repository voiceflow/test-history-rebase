import React from 'react';

import { NewCommentAPI } from '@/pages/Canvas/types';
import { Coords } from '@/utils/geometry';

export type InternalNewCommentAPI = NewCommentAPI & {
  origin: Coords | null;
};

export const useNewCommentAPI = () => {
  const [origin, setOrigin] = React.useState<Coords | null>(null);

  return React.useMemo<InternalNewCommentAPI>(
    () => ({
      origin,
      getOrigin: () => origin,
      show: (coords) => setOrigin(coords),
      hide: () => setOrigin(null),
    }),
    [origin]
  );
};
