import { Utils } from '@voiceflow/common';
import * as RealtimeSDK from '@voiceflow/realtime-sdk';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { ActiveVersionContext } from '@/ducks/version/utils';
import { useDispatch } from '@/hooks';

export interface DiagramHeartbeatContextValue {
  lockEntities: (type: RealtimeSDK.diagram.awareness.LockEntityType, entityIDs: string[]) => Promise<void>;
  unlockEntities: (type: RealtimeSDK.diagram.awareness.LockEntityType, entityIDs: string[]) => Promise<void>;
}

export const DiagramHeartbeatContext = React.createContext<DiagramHeartbeatContextValue>({
  lockEntities: () => Promise.resolve(),
  unlockEntities: () => Promise.resolve(),
});

export const { Consumer: DiagramHeartbeatConsumer } = DiagramHeartbeatContext;

const HEARTBEAT_TIMEOUT = 7000; // 7 seconds

interface DiagramHeartbeatProviderProps extends React.PropsWithChildren {
  isSubscribed: boolean;
  diagramID: string | null;
  context: ActiveVersionContext;
}

export const DiagramHeartbeatProvider: React.FC<DiagramHeartbeatProviderProps> = ({ diagramID, context, children, isSubscribed }) => {
  const heartbeatIsActive = isSubscribed;

  // heartbeat action is attached to a specific context, component should remount for new action
  const staticContext = React.useMemo(() => ({ ...context, diagramID }), []);
  const activeDiagramHeartbeat = useDispatch(Diagram.diagramHeartbeat, staticContext);

  const locksMapRef = React.useRef<RealtimeSDK.diagram.awareness.HeartbeatLocksMap>({});
  const heartbeatIsActiveRef = React.useRef(heartbeatIsActive);

  heartbeatIsActiveRef.current = heartbeatIsActive;

  const lockEntitiesLocally = (type: RealtimeSDK.diagram.awareness.LockEntityType, entityIDs: string[]) => {
    locksMapRef.current[type] = Utils.array.unique([...(locksMapRef.current[type] ?? []), ...entityIDs]);
  };

  const unlockEntitiesLocally = (type: RealtimeSDK.diagram.awareness.LockEntityType, entityIDs: string[]) => {
    const nextEntities = Utils.array.withoutValues(locksMapRef.current[type] ?? [], entityIDs);

    if (!nextEntities.length) {
      delete locksMapRef.current[type];
    } else {
      locksMapRef.current[type] = nextEntities;
    }
  };

  const lockEntities = React.useCallback(async (type: RealtimeSDK.diagram.awareness.LockEntityType, entityIDs: string[]) => {
    // skip any locks if the heartbeat is not active
    if (!heartbeatIsActiveRef.current) return;

    // we should lock locally before lock on the server
    // otherwise timeout heartbeat action can override the lock if the timeout fired while "lock" is in progress
    lockEntitiesLocally(type, entityIDs);

    try {
      await activeDiagramHeartbeat({
        lock: { type, entityIDs },
        unlock: null,
        locksMap: locksMapRef.current,
        forceSync: false,
      });
    } catch {
      unlockEntitiesLocally(type, entityIDs);
    }
  }, []);

  const unlockEntities = React.useCallback(async (type: RealtimeSDK.diagram.awareness.LockEntityType, entityIDs: string[]) => {
    // same here, we should unlock locally before unlock on the server
    // otherwise heartbeat action can override the unlock if the heartbeat fired while "unlock" action is in progress
    unlockEntitiesLocally(type, entityIDs);

    // it's safe to don't handle the error here
    await activeDiagramHeartbeat({
      lock: null,
      unlock: { type, entityIDs },
      locksMap: locksMapRef.current,
      forceSync: false,
    });
  }, []);

  React.useEffect(() => {
    if (!heartbeatIsActive) return undefined;

    let timeout: NodeJS.Timeout;

    const heartbeat = () => {
      activeDiagramHeartbeat({
        lock: null,
        unlock: null,
        locksMap: locksMapRef.current,
        forceSync: true,
      });

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
