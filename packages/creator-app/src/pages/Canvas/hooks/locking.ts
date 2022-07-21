import { Utils } from '@voiceflow/common';
import * as RealtimeSDK from '@voiceflow/realtime-sdk';
import React from 'react';
import { useDispatch } from 'react-redux';

import * as Realtime from '@/ducks/realtime';
import { useFeature, useForceUpdate, useSelector } from '@/hooks';
import { LockOwner } from '@/models';
import { DiagramHeartbeatContext } from '@/pages/Project/contexts';
import { Selector } from '@/store/types';

export interface LockOptions<T> {
  disabled: boolean;
  createLock: (target: T) => void;
  createUnlock: (target: T) => void;
  isLockedSelector: Selector<(target: T) => boolean>;
  lockOwnerSelector: Selector<(target: T) => LockOwner | null>;
}

const useGenericLock = <T>(target: T, { disabled, createLock, createUnlock, lockOwnerSelector, isLockedSelector }: LockOptions<T>) => {
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
  const dispatch = useDispatch();
  const diagramHeartbeat = React.useContext(DiagramHeartbeatContext);
  const atomicActionsPhase2 = useFeature(RealtimeSDK.FeatureFlag.ATOMIC_ACTIONS_PHASE_2);

  return useGenericLock(nodeID, {
    disabled,
    isLockedSelector: Realtime.isNodeEditLockedSelector,
    lockOwnerSelector: Realtime.editLockOwnerSelector,

    createLock: (id: string) =>
      atomicActionsPhase2.isEnabled
        ? diagramHeartbeat.lockEntities(RealtimeSDK.diagram.awareness.LockEntityType.NODE_EDIT, [id])
        : dispatch(Realtime.sendRealtimeUpdate(Realtime.lockNodes([id], [Realtime.LockType.EDIT]))),

    createUnlock: (id: string) =>
      atomicActionsPhase2.isEnabled
        ? diagramHeartbeat.unlockEntities(RealtimeSDK.diagram.awareness.LockEntityType.NODE_EDIT, [id])
        : dispatch(Realtime.sendRealtimeUpdate(Realtime.unlockNodes([id], [Realtime.LockType.EDIT]))),
  });
};
