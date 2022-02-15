import { Utils } from '@voiceflow/common';
import React from 'react';
import { useDispatch } from 'react-redux';

import * as Realtime from '@/ducks/realtime';
import { useForceUpdate, useSelector } from '@/hooks';
import { LockOwner } from '@/models';
import { AnyThunk, Selector } from '@/store/types';

export interface LockOptions<T> {
  disabled: boolean;
  createLockAction: (target: T) => AnyThunk;
  createUnlockAction: (target: T) => AnyThunk;
  lockOwnerSelector: Selector<(target: T) => LockOwner | null>;
  isLockedSelector: Selector<(target: T) => boolean>;
}

const useGenericLock = <T>(target: T, { disabled, createLockAction, createUnlockAction, lockOwnerSelector, isLockedSelector }: LockOptions<T>) => {
  const [forceUpdate, forceUpdateKey] = useForceUpdate();
  const lockOwner = useSelector(lockOwnerSelector)(target);
  const isTargetLocked = useSelector(isLockedSelector)(target);
  const teardownHandler = React.useRef<VoidFunction>(Utils.functional.noop);
  const prevState = React.useRef<{ target: T; lockOwner: LockOwner | null } | null>(null);
  const dispatch = useDispatch();

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

/**
 * @deprecated
 */
export const useEditLock = (nodeID: string, disabled: boolean) =>
  useGenericLock(nodeID, {
    disabled,
    createLockAction: (id: string) => Realtime.sendRealtimeUpdate(Realtime.lockNodes([id], [Realtime.LockType.EDIT])),
    createUnlockAction: (id: string) => Realtime.sendRealtimeUpdate(Realtime.unlockNodes([id], [Realtime.LockType.EDIT])),
    lockOwnerSelector: Realtime.editLockOwnerSelector,
    isLockedSelector: Realtime.isNodeEditLockedSelector,
  });

/**
 * @deprecated
 */
export const useResourceLock = (resourceType: Realtime.ResourceType, disabled: boolean) =>
  useGenericLock(resourceType, {
    disabled,
    createLockAction: (type: Realtime.ResourceType) => Realtime.sendRealtimeProjectUpdate(Realtime.lockResource(type)),
    createUnlockAction: (type: Realtime.ResourceType) => Realtime.sendRealtimeProjectUpdate(Realtime.unlockResource(type)),
    lockOwnerSelector: Realtime.resourceLockOwnerSelector,
    isLockedSelector: Realtime.isResourceLockedSelector,
  });
