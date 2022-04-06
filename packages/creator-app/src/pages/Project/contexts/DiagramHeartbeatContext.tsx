import { Nullish, Utils } from '@voiceflow/common';
import * as RealtimeSDK from '@voiceflow/realtime-sdk';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { useDispatch } from '@/hooks';

export interface DiagramHeartbeatContextValue {
  lockEntities: (type: RealtimeSDK.diagram.awareness.LockEntityType, entities: string[]) => Promise<void>;
  unlockEntities: (type: RealtimeSDK.diagram.awareness.LockEntityType, entities: string[]) => Promise<void>;
}

export const DiagramHeartbeatContext = React.createContext<DiagramHeartbeatContextValue>({
  lockEntities: () => Promise.resolve(),
  unlockEntities: () => Promise.resolve(),
});

export const { Consumer: DiagramHeartbeatConsumer } = DiagramHeartbeatContext;

const HEARTBEAT_TIMEOUT = 10000; // 10 seconds

interface DiagramHeartbeatProviderProps {
  diagramID: Nullish<string>;
  isSubscribed: boolean;
}

export const DiagramHeartbeatProvider: React.FC<DiagramHeartbeatProviderProps> = ({ children, diagramID, isSubscribed }) => {
  const heartbeatIsActive = !!diagramID && isSubscribed;

  const activeDiagramHeartbeat = useDispatch(Diagram.activeDiagramHeartbeat);
  const lockActiveDiagramEntities = useDispatch(Diagram.lockActiveDiagramEntities);
  const unlockActiveDiagramEntities = useDispatch(Diagram.unlockActiveDiagramEntities);

  const locksMapRef = React.useRef<RealtimeSDK.diagram.awareness.HeartbeatLocksMap>({});
  const heartbeatIsActiveRef = React.useRef(heartbeatIsActive);

  heartbeatIsActiveRef.current = heartbeatIsActive;

  const lockEntities = React.useCallback(async (type: RealtimeSDK.diagram.awareness.LockEntityType, entities: string[]) => {
    // skip any locks if the heartbeat is not active
    if (!heartbeatIsActiveRef.current) return;

    await lockActiveDiagramEntities(type, entities);

    locksMapRef.current[type] = Utils.array.unique([...(locksMapRef.current[type] ?? []), ...entities]);
  }, []);

  const unlockEntities = React.useCallback(async (type: RealtimeSDK.diagram.awareness.LockEntityType, entities: string[]) => {
    await unlockActiveDiagramEntities(type, entities);

    const nextEntities = Utils.array.withoutValues(locksMapRef.current[type] ?? [], entities);

    if (!nextEntities.length) {
      delete locksMapRef.current[type];
    } else {
      locksMapRef.current[type] = nextEntities;
    }
  }, []);

  React.useEffect(() => {
    if (!heartbeatIsActive) return undefined;

    let timeout: NodeJS.Timeout;

    const heartbeat = () => {
      activeDiagramHeartbeat(locksMapRef.current);

      timeout = setTimeout(heartbeat, HEARTBEAT_TIMEOUT);
    };

    timeout = setTimeout(heartbeat, HEARTBEAT_TIMEOUT);

    return () => {
      locksMapRef.current = {};
      clearTimeout(timeout);
    };
  }, [heartbeatIsActive]);

  const api = useContextApi({ lockEntities, unlockEntities });

  return <DiagramHeartbeatContext.Provider value={api}>{children}</DiagramHeartbeatContext.Provider>;
};
