import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useForceUpdate, useSelector } from '@/hooks';
import type { LockOwner } from '@/models';
import { DiagramHeartbeatContext } from '@/pages/Project/contexts';
import type { Selector } from '@/store/types';

export interface LockOptions<T> {
  disabled: boolean;
  createLock: (target: T) => void;
  createUnlock: (target: T) => void;
  isLockedSelector: Selector<(target: T) => boolean>;
  lockOwnerSelector: Selector<(target: T) => LockOwner | null>;
}

const useGenericLock = <T>(
  target: T,
  { disabled, createLock, createUnlock, lockOwnerSelector, isLockedSelector }: LockOptions<T>
) => {
  const [forceUpdate, forceUpdateKey] = useForceUpdate();
  const lockOwner = useSelector(lockOwnerSelector)(target);
  const isTargetLocked = useSelector(isLockedSelector)(target);

  const prevState = React.useRef<{ target: T; lockOwner: LockOwner | null } | null>(null);
  const teardownHandler = React.useRef<VoidFunction>(Utils.functional.noop);
  const heartbeatTimeout = React.useRef<NodeJS.Timeout | null>(null);

  if (prevState.current?.target !== target || (lockOwner && prevState.current?.lockOwner !== lockOwner)) {
    // initialize the state
    prevState.current = { target, lockOwner };
  }

  const teardown = () => {
    teardownHandler.current();
    teardownHandler.current = Utils.functional.noop;
  };

  const lockTarget = () => {
    prevState.current = null;
    teardownHandler.current = () => createUnlock(target);

    if (heartbeatTimeout.current !== null) {
      clearTimeout(heartbeatTimeout.current);
    }

    createLock(target);
  };

  const acquireLock = () => {
    lockTarget();
    forceUpdate();
  };

  React.useEffect(() => {
    if (!disabled && !isTargetLocked) {
      const previous = prevState.current?.lockOwner;

      lockTarget();

      if (previous) {
        forceUpdate();
      }
    }

    return teardown;
  }, [target, disabled]);

  return {
    lockOwner,
    prevOwner: prevState.current?.lockOwner || null,
    acquireLock,
    forceUpdateKey,
  };
};

export const useEditLock = (nodeID: string, disabled: boolean) => {
  const diagramHeartbeat = React.useContext(DiagramHeartbeatContext);

  return useGenericLock(nodeID, {
    disabled,
    isLockedSelector: DiagramV2.isNodeEditLockedSelector,
    lockOwnerSelector: DiagramV2.editLockOwnerSelector,

    createLock: (id: string) =>
      diagramHeartbeat.lockEntities(Realtime.diagram.awareness.LockEntityType.NODE_EDIT, [id]),

    createUnlock: (id: string) =>
      diagramHeartbeat.unlockEntities(Realtime.diagram.awareness.LockEntityType.NODE_EDIT, [id]),
  });
};
