import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Realtime from '@/ducks/realtime';
import { useForceUpdate } from '@/hooks';

export const useGenericLock = (target, { disabled, createLockAction, createUnlockAction, lockOwnerSelector, isLockedSelector }) => {
  const [forceUpdate, forceUpdateKey] = useForceUpdate();
  const lockOwner = useSelector(lockOwnerSelector)(target);
  const isTargetLocked = useSelector(isLockedSelector)(target);
  const teardownHandler = React.useRef(null);
  const prevState = React.useRef(null);
  const dispatch = useDispatch();

  if (prevState.current?.target !== target || (lockOwner && prevState.current?.lockOwner !== lockOwner)) {
    // initialize the state
    prevState.current = { target, lockOwner };
  }

  const teardown = () => {
    teardownHandler.current?.();
    teardownHandler.current = null;
  };

  const lockTarget = () => {
    prevState.current = null;
    teardownHandler.current = () => dispatch(createUnlockAction(target));

    dispatch(createLockAction(target));
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

export const useEditLock = (nodeID, disabled) =>
  useGenericLock(nodeID, {
    disabled,
    createLockAction: (id) => Realtime.sendRealtimeUpdate(Realtime.lockNodes([id], [Realtime.LockType.EDIT])),
    createUnlockAction: (id) => Realtime.sendRealtimeUpdate(Realtime.unlockNodes([id], [Realtime.LockType.EDIT])),
    lockOwnerSelector: Realtime.editLockOwnerSelector,
    isLockedSelector: Realtime.isNodeEditLockedSelector,
  });

export const useResourceLock = (resourceType, disabled) =>
  useGenericLock(resourceType, {
    disabled,
    createLockAction: (type) => Realtime.sendRealtimeProjectUpdate(Realtime.lockResource(type)),
    createUnlockAction: (type) => Realtime.sendRealtimeProjectUpdate(Realtime.unlockResource(type)),
    lockOwnerSelector: Realtime.resourceLockOwnerSelector,
    isLockedSelector: Realtime.isResourceLockedSelector,
  });
