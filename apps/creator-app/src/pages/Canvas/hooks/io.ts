import React from 'react';

import client from '@/client';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import type Engine from '../engine';

export const useIO = (engine: Engine) => {
  const token = useSelector(Session.authTokenSelector);
  const diagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  React.useEffect(() => {
    if (!token || !diagramID) return undefined;

    const io = client.realtimeIO(token);

    engine.io.join(io, diagramID);
    io.io.on('reconnect', () => {
      engine.io.join(io, diagramID);
    });

    return () => engine.io.leave();
  }, [token, engine, diagramID]);
};
